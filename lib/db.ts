import neo4j, { Driver, Record as Neo4jRecord } from "neo4j-driver";

/**
 * Single shared driver instance. CognoDB speaks Bolt over TLS (bolt+s://),
 * so the official Neo4j JavaScript driver works unmodified — only the
 * connection details differ, and those come from the environment.
 */
let driver: Driver | null = null;

export class DatabaseUnavailableError extends Error {
  constructor(cause: unknown) {
    super(
      cause instanceof Error
        ? `Could not reach the graph database: ${cause.message}`
        : "Could not reach the graph database.",
    );
    this.name = "DatabaseUnavailableError";
  }
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new DatabaseUnavailableError(
      new Error(`Missing required environment variable ${name}`),
    );
  }
  return value;
}

function getDriver(): Driver {
  if (driver) return driver;

  const uri = requiredEnv("NEO4J_URI");
  const username = requiredEnv("NEO4J_USERNAME");
  const password = requiredEnv("NEO4J_PASSWORD");

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionPoolSize: 10,
    connectionAcquisitionTimeout: 8000,
    connectionTimeout: 8000,
  });

  return driver;
}

/** Cheap connectivity probe used by the health check and startup diagnostics. */
export async function checkConnection(): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await getDriver().verifyConnectivity();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown connection error",
    };
  }
}

type Params = Record<string, unknown>;

async function run<T>(
  cypher: string,
  params: Params,
  mode: "READ" | "WRITE",
  map: (records: Neo4jRecord[]) => T,
): Promise<T> {
  const database = process.env.NEO4J_DATABASE || "neo4j";
  const session = getDriver().session({
    database,
    defaultAccessMode: mode === "READ" ? neo4j.session.READ : neo4j.session.WRITE,
  });
  try {
    const result =
      mode === "READ"
        ? await session.executeRead((tx) => tx.run(cypher, params))
        : await session.executeWrite((tx) => tx.run(cypher, params));
    return map(result.records);
  } catch (err) {
    throw new DatabaseUnavailableError(err);
  } finally {
    await session.close();
  }
}

/** Run a parameterised read (Cypher) query and map the resulting records. */
export function read<T>(
  cypher: string,
  params: Params,
  map: (records: Neo4jRecord[]) => T,
): Promise<T> {
  return run(cypher, params, "READ", map);
}

/** Run a parameterised write (Cypher) query and map the resulting records. */
export function write<T>(
  cypher: string,
  params: Params,
  map: (records: Neo4jRecord[]) => T,
): Promise<T> {
  return run(cypher, params, "WRITE", map);
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
  }
}
