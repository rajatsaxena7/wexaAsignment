export interface SeedRole {
  id: string;
  title: string;
  category: string;
  description: string;
  /** [skillId, importance] */
  requires: [string, "core" | "nice-to-have"][];
}

export const roles: SeedRole[] = [
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data & AI",
    description: "Turns messy data into models and insights that inform decisions.",
    requires: [
      ["python", "core"],
      ["statistics", "core"],
      ["machine-learning", "core"],
      ["data-visualization", "core"],
      ["sql-basics", "nice-to-have"],
      ["linear-algebra", "nice-to-have"],
    ],
  },
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "Data & AI",
    description: "Builds and ships production systems powered by trained models.",
    requires: [
      ["python", "core"],
      ["machine-learning", "core"],
      ["deep-learning", "core"],
      ["ml-ops", "core"],
      ["docker", "nice-to-have"],
      ["cloud-fundamentals", "nice-to-have"],
    ],
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Web",
    description: "Builds the interfaces people actually see and use in the browser.",
    requires: [
      ["html-css", "core"],
      ["javascript", "core"],
      ["frontend-frameworks", "core"],
      ["responsive-design", "core"],
      ["ui-ux-design", "nice-to-have"],
    ],
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Web",
    description: "Builds the services and data layer behind an application.",
    requires: [
      ["oop", "core"],
      ["databases", "core"],
      ["backend-apis", "core"],
      ["sql-basics", "core"],
      ["system-design", "nice-to-have"],
    ],
  },
  {
    id: "fullstack-developer",
    title: "Full-Stack Developer",
    category: "Web",
    description: "Comfortable across the frontend, backend, and the data in between.",
    requires: [
      ["fullstack", "core"],
      ["javascript", "core"],
      ["databases", "core"],
      ["git-version-control", "core"],
    ],
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Infrastructure",
    description: "Keeps build, deployment, and infrastructure fast and reliable.",
    requires: [
      ["linux-cli", "core"],
      ["docker", "core"],
      ["kubernetes", "core"],
      ["ci-cd", "core"],
      ["cloud-architecture", "core"],
      ["infra-as-code", "nice-to-have"],
    ],
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    category: "Data & AI",
    description: "Builds the pipelines and infrastructure that move and shape data.",
    requires: [
      ["python", "core"],
      ["sql-basics", "core"],
      ["data-engineering", "core"],
      ["big-data", "core"],
      ["data-warehousing", "nice-to-have"],
      ["cloud-fundamentals", "nice-to-have"],
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & AI",
    description: "Answers business questions by exploring and explaining data.",
    requires: [
      ["excel", "core"],
      ["sql-basics", "core"],
      ["statistics", "core"],
      ["data-visualization", "core"],
      ["business-analytics", "nice-to-have"],
    ],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Product",
    description: "Decides what gets built and why, and rallies a team around it.",
    requires: [
      ["product-management", "core"],
      ["agile-scrum", "core"],
      ["business-analytics", "core"],
      ["product-strategy", "core"],
      ["ui-ux-design", "nice-to-have"],
    ],
  },
];
