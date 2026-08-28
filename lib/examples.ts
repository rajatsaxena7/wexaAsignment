export interface PathExample {
  id: string;
  title: string;
  description: string;
  knownSkillIds: string[];
  goal: { type: "skill"; id: string } | { type: "role"; id: string };
}

/** One-click starting points so a first-time visitor sees a real roadmap before configuring anything. */
export const examples: PathExample[] = [
  {
    id: "python-to-ml",
    title: "I know Python — get me to Machine Learning",
    description: "Watch the graph route you through Statistics and Linear Algebra to get there.",
    knownSkillIds: ["python", "math-basics"],
    goal: { type: "skill", id: "machine-learning" },
  },
  {
    id: "beginner-frontend",
    title: "Starting from scratch — become a Frontend Developer",
    description: "No known skills. See the full roadmap a role needs, fully ordered.",
    knownSkillIds: [],
    goal: { type: "role", id: "frontend-developer" },
  },
  {
    id: "basics-to-devops",
    title: "I know the command line — reach DevOps Engineer",
    description: "A role that pulls together several skill chains — containers, CI/CD, cloud — at once.",
    knownSkillIds: ["linux-cli", "prog-fundamentals", "git-version-control"],
    goal: { type: "role", id: "devops-engineer" },
  },
];
