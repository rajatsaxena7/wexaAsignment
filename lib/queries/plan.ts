import { read } from "../db";
import { toCourse, toSkill } from "../mappers";
import { buildRoadmap, ClosureNode } from "../roadmap";
import { Course, PlanResult } from "../types";

async function fetchClosureFromGoals(goalIds: string[]): Promise<ClosureNode[]> {
  if (goalIds.length === 0) return [];
  return read(
    `
    UNWIND $goalIds AS goalId
    MATCH (goal:Skill {id: goalId})-[:REQUIRES*0..8]->(skill:Skill)
    WITH DISTINCT skill
    RETURN skill, [(skill)-[:REQUIRES]->(dep:Skill) | dep.id] AS directPrereqIds
    `,
    { goalIds },
    (records) =>
      records.map((r) => ({
        skill: toSkill(r.get("skill")),
        directPrereqIds: r.get("directPrereqIds") as string[],
      })),
  );
}

async function fetchCourseCoverage(skillIds: string[]): Promise<Map<string, Course[]>> {
  if (skillIds.length === 0) return new Map();
  const rows = await read(
    `
    MATCH (c:Course)-[:TEACHES]->(s:Skill)
    WHERE s.id IN $skillIds
    WITH c, collect(DISTINCT s.id) AS coversIds
    RETURN c, coversIds
    ORDER BY size(coversIds) DESC, c.hours ASC
    `,
    { skillIds },
    (records) =>
      records.map((r) => ({ course: toCourse(r.get("c")), coversIds: r.get("coversIds") as string[] })),
  );
  const map = new Map<string, Course[]>();
  for (const { course, coversIds } of rows) {
    for (const id of coversIds) {
      const list = map.get(id) ?? [];
      list.push(course);
      map.set(id, list);
    }
  }
  return map;
}

/** Fewest REQUIRES hops from any already-known skill to any goal skill. */
async function shortestHops(knownIds: string[], goalIds: string[]): Promise<number | null> {
  if (knownIds.length === 0 || goalIds.length === 0) return null;
  return read(
    `
    UNWIND $knownIds AS knownId
    UNWIND $goalIds AS goalId
    MATCH (k:Skill {id: knownId})
    MATCH (g:Skill {id: goalId})
    OPTIONAL MATCH p = shortestPath((g)-[:REQUIRES*0..8]->(k))
    WITH p WHERE p IS NOT NULL
    RETURN min(length(p)) AS hops
    `,
    { knownIds, goalIds },
    (records) => {
      const v = records[0]?.get("hops");
      if (v === null || v === undefined) return null;
      return (v as { toNumber?: () => number }).toNumber?.() ?? Number(v);
    },
  );
}

async function skillExists(id: string): Promise<boolean> {
  return read(`MATCH (s:Skill {id: $id}) RETURN s LIMIT 1`, { id }, (records) => records.length > 0);
}

export async function planForGoal(knownIds: string[], goalId: string): Promise<PlanResult | null> {
  if (!(await skillExists(goalId))) return null;

  const knownSet = new Set(knownIds);
  if (knownSet.has(goalId)) {
    return { steps: [], totalHours: 0, totalCourses: 0, shortestHops: 0, alreadyMet: true };
  }

  const closure = await fetchClosureFromGoals([goalId]);
  const neededIds = closure.map((n) => n.skill.id).filter((id) => !knownSet.has(id));

  const [coverage, hops] = await Promise.all([
    fetchCourseCoverage(neededIds),
    shortestHops(knownIds, [goalId]),
  ]);

  const roadmap = buildRoadmap(closure, knownSet, coverage);
  return { ...roadmap, shortestHops: hops, alreadyMet: false };
}

/** Same idea as planForGoal, but for every skill a Role requires at once — a multi-source traversal. */
export async function planForRole(knownIds: string[], roleId: string): Promise<PlanResult | null> {
  const requiredIds = await read(
    `MATCH (:Role {id: $roleId})-[:REQUIRES_SKILL]->(s:Skill) RETURN s.id AS id`,
    { roleId },
    (records) => records.map((r) => r.get("id") as string),
  );
  if (requiredIds.length === 0) {
    const roleExists = await read(
      `MATCH (r:Role {id: $roleId}) RETURN r LIMIT 1`,
      { roleId },
      (records) => records.length > 0,
    );
    return roleExists ? { steps: [], totalHours: 0, totalCourses: 0, shortestHops: 0, alreadyMet: true } : null;
  }

  const knownSet = new Set(knownIds);
  const missingGoalIds = requiredIds.filter((id) => !knownSet.has(id));
  if (missingGoalIds.length === 0) {
    return { steps: [], totalHours: 0, totalCourses: 0, shortestHops: 0, alreadyMet: true };
  }

  const closure = await fetchClosureFromGoals(missingGoalIds);
  const neededIds = closure.map((n) => n.skill.id).filter((id) => !knownSet.has(id));

  const [coverage, hops] = await Promise.all([
    fetchCourseCoverage(neededIds),
    shortestHops(knownIds, missingGoalIds),
  ]);

  const roadmap = buildRoadmap(closure, knownSet, coverage);
  return { ...roadmap, shortestHops: hops, alreadyMet: false };
}
