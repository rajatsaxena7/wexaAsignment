/** Referential-integrity check for the seed dataset, run before seeding. */
import { skills, relatedPairs } from "./data/skills";
import { courses } from "./data/courses";
import { roles } from "./data/roles";

const skillIds = new Set(skills.map((s) => s.id));
const errors: string[] = [];

for (const s of skills) {
  for (const req of s.requires ?? []) {
    if (!skillIds.has(req)) errors.push(`Skill "${s.id}" requires unknown skill "${req}"`);
    if (req === s.id) errors.push(`Skill "${s.id}" requires itself`);
  }
}

for (const [a, b] of relatedPairs) {
  if (!skillIds.has(a)) errors.push(`relatedPairs references unknown skill "${a}"`);
  if (!skillIds.has(b)) errors.push(`relatedPairs references unknown skill "${b}"`);
}

const courseIds = new Set<string>();
for (const c of courses) {
  if (courseIds.has(c.id)) errors.push(`Duplicate course id "${c.id}"`);
  courseIds.add(c.id);
  for (const skillId of c.teaches) {
    if (!skillIds.has(skillId)) errors.push(`Course "${c.id}" teaches unknown skill "${skillId}"`);
  }
}

for (const r of roles) {
  for (const [skillId] of r.requires) {
    if (!skillIds.has(skillId)) errors.push(`Role "${r.id}" requires unknown skill "${skillId}"`);
  }
}

// Cycle check on the REQUIRES graph (DFS).
const graph = new Map<string, string[]>(skills.map((s) => [s.id, s.requires ?? []]));
const WHITE = 0, GRAY = 1, BLACK = 2;
const state = new Map<string, number>(skills.map((s) => [s.id, WHITE]));
function dfs(id: string, stack: string[]): void {
  state.set(id, GRAY);
  for (const dep of graph.get(id) ?? []) {
    if (state.get(dep) === GRAY) {
      errors.push(`Cycle detected: ${[...stack, id, dep].join(" -> ")}`);
    } else if (state.get(dep) === WHITE) {
      dfs(dep, [...stack, id]);
    }
  }
  state.set(id, BLACK);
}
for (const s of skills) if (state.get(s.id) === WHITE) dfs(s.id, []);

const skillsWithNoCourse = skills.filter((s) => !courses.some((c) => c.teaches.includes(s.id)));

console.log(`Skills: ${skills.length}`);
console.log(`Courses: ${courses.length}`);
console.log(`Roles: ${roles.length}`);
console.log(`Skills with no course: ${skillsWithNoCourse.length} (${skillsWithNoCourse.map((s) => s.id).join(", ")})`);

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s) found:`);
  for (const e of errors) console.error(" - " + e);
  process.exit(1);
} else {
  console.log("\nNo integrity problems found.");
}
