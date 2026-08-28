import { read } from "../db";
import { toSkill } from "../mappers";
import { FoundationalSkill } from "../types";

/**
 * "Foundational" skills: how many other skills transitively require this
 * one, direct or indirect. In SQL this is a recursive self-join evaluated
 * once per candidate row (or a materialised closure table kept in sync by
 * triggers); here it's a single variable-length traversal plus a count.
 */
export async function getFoundationalSkills(limit = 10): Promise<FoundationalSkill[]> {
  return read(
    `
    MATCH (s:Skill)
    OPTIONAL MATCH (dependent:Skill)-[:REQUIRES*1..8]->(s)
    WITH s, count(DISTINCT dependent) AS unlocks
    ORDER BY unlocks DESC, s.name ASC
    LIMIT $limit
    RETURN s, unlocks
    `,
    { limit: Math.trunc(limit) },
    (records) =>
      records.map((r) => ({
        skill: toSkill(r.get("s")),
        unlocks: (r.get("unlocks") as { toNumber?: () => number }).toNumber?.() ?? Number(r.get("unlocks")),
      })),
  );
}

export interface GraphStats {
  skills: number;
  courses: number;
  roles: number;
  prerequisiteLinks: number;
  longestChain: number;
}

const num = (v: unknown) => (v as { toNumber?: () => number })?.toNumber?.() ?? Number(v ?? 0);

export async function getGraphStats(): Promise<GraphStats> {
  const [counts, longestChain] = await Promise.all([
    read(
      `
      OPTIONAL MATCH (s:Skill)
      WITH count(DISTINCT s) AS skills
      OPTIONAL MATCH (c:Course)
      WITH skills, count(DISTINCT c) AS courses
      OPTIONAL MATCH (r:Role)
      WITH skills, courses, count(DISTINCT r) AS roles
      OPTIONAL MATCH ()-[req:REQUIRES]->()
      RETURN skills, courses, roles, count(req) AS prerequisiteLinks
      `,
      {},
      (records) => {
        const r = records[0];
        return {
          skills: num(r.get("skills")),
          courses: num(r.get("courses")),
          roles: num(r.get("roles")),
          prerequisiteLinks: num(r.get("prerequisiteLinks")),
        };
      },
    ),
    read(
      `
      MATCH (a:Skill)
      WHERE NOT (a)<-[:REQUIRES]-()
      OPTIONAL MATCH p = (a)-[:REQUIRES*]->(:Skill)
      RETURN coalesce(max(length(p)), 0) AS longestChain
      `,
      {},
      (records) => num(records[0]?.get("longestChain")),
    ),
  ]);
  return { ...counts, longestChain };
}
