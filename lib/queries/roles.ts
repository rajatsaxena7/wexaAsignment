import { read } from "../db";
import { toRole, toSkill } from "../mappers";
import { Role, RoleDetail } from "../types";

export async function listRoles(): Promise<Role[]> {
  return read(
    `MATCH (r:Role) RETURN r ORDER BY r.category, r.title`,
    {},
    (records) => records.map((r) => toRole(r.get("r"))),
  );
}

export async function getRoleDetail(id: string): Promise<RoleDetail | null> {
  return read(
    `
    MATCH (r:Role {id: $id})
    RETURN r,
      [(r)-[req:REQUIRES_SKILL]->(s:Skill) | {skill: s, importance: req.importance}] AS required
    `,
    { id },
    (records) => {
      if (records.length === 0) return null;
      const r = records[0];
      const role = toRole(r.get("r"));
      const required = r.get("required") as { skill: unknown; importance: string }[];
      return {
        ...role,
        requiredSkills: required
          .map((entry) => ({
            skill: toSkill(entry.skill as never),
            importance: entry.importance as "core" | "nice-to-have",
          }))
          .sort((a, b) =>
            a.importance === b.importance
              ? a.skill.name.localeCompare(b.skill.name)
              : a.importance === "core"
                ? -1
                : 1,
          ),
      };
    },
  );
}
