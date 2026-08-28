import { read } from "../db";
import { toCourse, toSkill } from "../mappers";
import { Course, CourseDetail } from "../types";
import { Node } from "neo4j-driver";

/**
 * Course detail plus "also consider" — other courses that teach at least one
 * of the same skills, ranked by how many skills they share. This is a
 * two-hop traversal (Course -> Skill <- Course) that would need a self-join
 * through a bridge table in SQL; here it's one pattern comprehension. The
 * per-shared-skill duplicates it returns double as an overlap-count signal,
 * so ranking happens cheaply in application code instead of a second round trip.
 */
export async function getCourseDetail(id: string): Promise<CourseDetail | null> {
  return read(
    `
    MATCH (c:Course {id: $id})
    RETURN c,
      [(c)-[:TEACHES]->(s:Skill) | s] AS taught,
      [(c)-[:TEACHES]->(:Skill)<-[:TEACHES]-(other:Course) WHERE other <> c | other] AS overlapping
    `,
    { id },
    (records) => {
      if (records.length === 0) return null;
      const r = records[0];
      const course = toCourse(r.get("c"));

      const counts = new Map<string, number>();
      const byId = new Map<string, Course>();
      for (const node of r.get("overlapping") as Node[]) {
        const other = toCourse(node);
        counts.set(other.id, (counts.get(other.id) ?? 0) + 1);
        byId.set(other.id, other);
      }
      const alsoConsider = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([courseId]) => byId.get(courseId)!);

      return {
        ...course,
        teaches: (r.get("taught") as Node[]).map(toSkill),
        alsoConsider,
      };
    },
  );
}
