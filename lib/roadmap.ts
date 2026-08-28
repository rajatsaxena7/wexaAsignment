import { Course, RoadmapStep, Skill } from "./types";

export interface ClosureNode {
  skill: Skill;
  directPrereqIds: string[];
}

interface RoadmapResult {
  steps: RoadmapStep[];
  totalHours: number;
  totalCourses: number;
}

/**
 * Turns a (possibly unordered) set of skills-with-direct-prerequisites into a
 * dependency-respecting sequence via Kahn's algorithm, then greedily attaches
 * the best-fit course to each step, letting one broad course satisfy several
 * steps at once when its coverage allows it.
 */
export function buildRoadmap(
  closure: ClosureNode[],
  knownIds: Set<string>,
  courseCoverage: Map<string, Course[]>,
): RoadmapResult {
  const byId = new Map(closure.map((n) => [n.skill.id, n]));
  const remaining = new Set(byId.keys());
  const placed = new Set<string>();
  const ordered: ClosureNode[] = [];

  while (remaining.size > 0) {
    let ready = [...remaining]
      .map((id) => byId.get(id)!)
      .filter((n) => n.directPrereqIds.every((p) => placed.has(p) || !byId.has(p)));

    // Guards against a malformed (cyclic) prerequisite graph: never loop forever,
    // just place whatever is left in a stable order.
    if (ready.length === 0) ready = [...remaining].map((id) => byId.get(id)!);

    ready.sort(
      (a, b) =>
        a.skill.category.localeCompare(b.skill.category) || a.skill.name.localeCompare(b.skill.name),
    );

    for (const node of ready) {
      ordered.push(node);
      placed.add(node.skill.id);
      remaining.delete(node.skill.id);
    }
  }

  // A course that teaches several needed skills at once (e.g. a full-stack
  // course covering both frontend and backend skills) is picked as the best
  // candidate for each of those steps, then billed only once below — you
  // take the course once, even though it satisfies multiple roadmap steps.
  const steps: RoadmapStep[] = ordered.map((node) => {
    const alreadyKnown = knownIds.has(node.skill.id);
    const course = alreadyKnown ? null : (courseCoverage.get(node.skill.id)?.[0] ?? null);
    return { skill: node.skill, alreadyKnown, unlockedBy: node.directPrereqIds, course };
  });

  const distinctCourses = new Map<string, Course>();
  for (const step of steps) if (step.course) distinctCourses.set(step.course.id, step.course);
  const totalHours = [...distinctCourses.values()].reduce((sum, c) => sum + c.hours, 0);

  return { steps, totalHours, totalCourses: distinctCourses.size };
}
