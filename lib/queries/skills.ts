import { read } from "../db";
import { toCourse, toSkill } from "../mappers";
import { Skill, SkillDetail } from "../types";

/** All skills, optionally filtered by a case-insensitive name/category substring. */
export async function listSkills(search?: string): Promise<Skill[]> {
  return read(
    `
    MATCH (s:Skill)
    WHERE $search = '' OR toLower(s.name) CONTAINS $search OR toLower(s.category) CONTAINS $search
    RETURN s
    ORDER BY s.category, s.name
    `,
    { search: (search ?? "").trim().toLowerCase() },
    (records) => records.map((r) => toSkill(r.get("s"))),
  );
}

export async function listSkillCategories(): Promise<string[]> {
  return read(
    `MATCH (s:Skill) RETURN DISTINCT s.category AS category ORDER BY category`,
    {},
    (records) => records.map((r) => r.get("category") as string),
  );
}

/**
 * Skill detail combining four independent traversals from the same node via
 * pattern comprehensions, so each relationship type is fetched without the
 * cartesian-product blow-up multiple OPTIONAL MATCH clauses would cause.
 */
export async function getSkillDetail(id: string): Promise<SkillDetail | null> {
  return read(
    `
    MATCH (s:Skill {id: $id})
    RETURN s,
      [(s)-[:REQUIRES]->(pre:Skill) | pre] AS prerequisites,
      [(dep:Skill)-[:REQUIRES]->(s) | dep] AS unlocks,
      [(s)-[:RELATED_TO]-(rel:Skill) | rel] AS related,
      [(c:Course)-[:TEACHES]->(s) | c] AS courses
    `,
    { id },
    (records) => {
      if (records.length === 0) return null;
      const r = records[0];
      const skill = toSkill(r.get("s"));
      return {
        ...skill,
        prerequisites: r.get("prerequisites").map(toSkill),
        unlocks: r.get("unlocks").map(toSkill),
        related: r.get("related").map(toSkill),
        courses: r.get("courses").map(toCourse),
      };
    },
  );
}
