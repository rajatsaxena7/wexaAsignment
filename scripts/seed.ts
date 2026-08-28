/**
 * Wipes and reloads the CognoDB instance with the LearnPath dataset:
 * Skills (with REQUIRES prerequisite chains and RELATED_TO sideways links),
 * Courses (TEACHES one or more skills), and Roles (REQUIRES_SKILL).
 *
 * Usage:
 *   npm run seed
 *
 * Reads NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD from .env.local (or .env).
 */
import { config } from "dotenv";
import path from "node:path";
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import neo4j from "neo4j-driver";
import { skills, relatedPairs } from "./data/skills";
import { courses } from "./data/courses";
import { roles } from "./data/roles";

async function main() {
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !username || !password) {
    console.error(
      "Missing NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD.\n" +
        "Copy .env.example to .env.local and fill in your CognoDB connection details.",
    );
    process.exit(1);
  }

  const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  const database = process.env.NEO4J_DATABASE || "neo4j";

  try {
    await driver.verifyConnectivity();
    console.log(`Connected to ${uri}`);
  } catch (err) {
    console.error("Could not connect to the database:", err instanceof Error ? err.message : err);
    await driver.close();
    process.exit(1);
  }

  const session = driver.session({ database });
  try {
    console.log("Resetting existing data...");
    await session.executeWrite((tx) => tx.run("MATCH (n) DETACH DELETE n"));

    console.log("Creating uniqueness constraints...");
    for (const label of ["Skill", "Course", "Role"]) {
      await session.executeWrite((tx) =>
        tx.run(`CREATE CONSTRAINT IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`),
      );
    }

    console.log(`Loading ${skills.length} skills...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        CREATE (s:Skill {id: row.id, name: row.name, category: row.category, description: row.description})
        `,
        { rows: skills.map(({ id, name, category, description }) => ({ id, name, category, description })) },
      ),
    );

    const requiresRows = skills.flatMap((s) => (s.requires ?? []).map((reqId) => ({ from: s.id, to: reqId })));
    console.log(`Linking ${requiresRows.length} skill prerequisites...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        MATCH (a:Skill {id: row.from}), (b:Skill {id: row.to})
        CREATE (a)-[:REQUIRES]->(b)
        `,
        { rows: requiresRows },
      ),
    );

    console.log(`Linking ${relatedPairs.length} related-skill pairs...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        MATCH (a:Skill {id: row.from}), (b:Skill {id: row.to})
        CREATE (a)-[:RELATED_TO]->(b)
        `,
        { rows: relatedPairs.map(([from, to]) => ({ from, to })) },
      ),
    );

    console.log(`Loading ${courses.length} courses...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        CREATE (c:Course {id: row.id, title: row.title, provider: row.provider, level: row.level, hours: row.hours, url: row.url})
        `,
        {
          rows: courses.map(({ id, title, provider, level, hours, url }) => ({
            id, title, provider, level, hours, url,
          })),
        },
      ),
    );

    const teachesRows = courses.flatMap((c) => c.teaches.map((skillId) => ({ courseId: c.id, skillId })));
    console.log(`Linking ${teachesRows.length} course-teaches-skill relationships...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        MATCH (c:Course {id: row.courseId}), (s:Skill {id: row.skillId})
        CREATE (c)-[:TEACHES]->(s)
        `,
        { rows: teachesRows },
      ),
    );

    console.log(`Loading ${roles.length} roles...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        CREATE (r:Role {id: row.id, title: row.title, category: row.category, description: row.description})
        `,
        { rows: roles.map(({ id, title, category, description }) => ({ id, title, category, description })) },
      ),
    );

    const roleReqRows = roles.flatMap((r) =>
      r.requires.map(([skillId, importance]) => ({ roleId: r.id, skillId, importance })),
    );
    console.log(`Linking ${roleReqRows.length} role skill requirements...`);
    await session.executeWrite((tx) =>
      tx.run(
        `
        UNWIND $rows AS row
        MATCH (r:Role {id: row.roleId}), (s:Skill {id: row.skillId})
        CREATE (r)-[:REQUIRES_SKILL {importance: row.importance}]->(s)
        `,
        { rows: roleReqRows },
      ),
    );

    console.log("\nSeed complete:");
    console.log(`  ${skills.length} skills, ${requiresRows.length} REQUIRES links, ${relatedPairs.length} RELATED_TO links`);
    console.log(`  ${courses.length} courses, ${teachesRows.length} TEACHES links`);
    console.log(`  ${roles.length} roles, ${roleReqRows.length} REQUIRES_SKILL links`);
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
