import { skills } from "./skills";

export interface SeedCourse {
  id: string;
  title: string;
  provider: string;
  level: "beginner" | "intermediate" | "advanced";
  hours: number;
  url: string;
  /** Skill IDs this course teaches — usually one, occasionally several. */
  teaches: string[];
}

const providers: [name: string, domain: string][] = [
  ["Coursepath Academy", "coursepath.io"],
  ["TechForward Institute", "techforward.dev"],
  ["DataCraft Learning", "datacraft.io"],
  ["OpenLearn Collective", "openlearn.co"],
  ["CloudSkills Hub", "cloudskills.dev"],
  ["BuildSchool", "buildschool.io"],
  ["PixelCraft Academy", "pixelcraft.design"],
  ["Systemwise", "systemwise.io"],
  ["Analytika School", "analytika.school"],
];

const ADVANCED = new Set([
  "algorithms", "deep-learning", "nlp", "computer-vision", "ml-ops", "system-design",
  "kubernetes", "infra-as-code", "cloud-architecture", "devops", "big-data",
  "product-strategy", "react-native",
]);
const BEGINNER = new Set([
  "math-basics", "prog-fundamentals", "html-css", "linux-cli", "excel",
  "git-version-control", "ui-ux-design", "agile-scrum", "product-management", "cloud-fundamentals",
]);

// Skills that intentionally have no primary course yet, to demonstrate the
// planner's "no course found — here's what to explore" empty state.
const NO_PRIMARY_COURSE = new Set(["discrete-math", "responsive-design", "data-warehousing"]);

function levelFor(skillId: string): SeedCourse["level"] {
  if (ADVANCED.has(skillId)) return "advanced";
  if (BEGINNER.has(skillId)) return "beginner";
  return "intermediate";
}

function hoursFor(level: SeedCourse["level"], skillId: string): number {
  // Small deterministic spread so courses at the same level aren't all
  // identical length, without needing per-skill hand-tuning.
  const variation = skillId.length % 5;
  if (level === "beginner") return 8 + variation;
  if (level === "advanced") return 28 + variation * 2;
  return 16 + variation;
}

function slugTitle(name: string): string {
  return name.replace(/[()]/g, "").replace(/\s+/g, " ").trim();
}

const primaryCourses: SeedCourse[] = skills
  .filter((s) => !NO_PRIMARY_COURSE.has(s.id))
  .map((s, i) => {
    const level = levelFor(s.id);
    const [provider, domain] = providers[i % providers.length];
    const titleSuffix = level === "beginner" ? "Fundamentals" : level === "advanced" ? "Deep Dive" : "in Practice";
    return {
      id: `${s.id}-101`,
      title: `${slugTitle(s.name)}: ${titleSuffix}`,
      provider,
      level,
      hours: hoursFor(level, s.id),
      url: `https://${domain}/courses/${s.id}-101`,
      teaches: [s.id],
    };
  });

// A handful of alternate/second courses on popular skills, so the planner has
// a real choice to rank (by coverage, then hours) rather than one option each.
const alternateCourses: SeedCourse[] = [
  { id: "python-201", title: "Python for Data & Automation", provider: "DataCraft Learning", level: "intermediate", hours: 14, url: "https://datacraft.io/courses/python-201", teaches: ["python"] },
  { id: "javascript-201", title: "Modern JavaScript, Fast Track", provider: "BuildSchool", level: "intermediate", hours: 12, url: "https://buildschool.io/courses/javascript-201", teaches: ["javascript"] },
  { id: "statistics-201", title: "Statistics for Data Practitioners", provider: "Analytika School", level: "intermediate", hours: 16, url: "https://analytika.school/courses/statistics-201", teaches: ["statistics"] },
  { id: "sql-basics-201", title: "SQL for Analysts", provider: "Analytika School", level: "beginner", hours: 9, url: "https://analytika.school/courses/sql-basics-201", teaches: ["sql-basics"] },
  { id: "machine-learning-201", title: "Applied Machine Learning Projects", provider: "TechForward Institute", level: "advanced", hours: 30, url: "https://techforward.dev/courses/machine-learning-201", teaches: ["machine-learning"] },
];

// Combo courses that teach several skills at once, so the planner's coverage
// ranking (a single course satisfying multiple roadmap steps) has something
// real to demonstrate.
const comboCourses: SeedCourse[] = [
  { id: "combo-fullstack-bootcamp", title: "Full-Stack Web Bootcamp", provider: "BuildSchool", level: "advanced", hours: 60, url: "https://buildschool.io/courses/fullstack-bootcamp", teaches: ["frontend-frameworks", "backend-apis", "fullstack"] },
  { id: "combo-devops-foundations", title: "DevOps Foundations: Containers to Cloud", provider: "CloudSkills Hub", level: "intermediate", hours: 26, url: "https://cloudskills.dev/courses/devops-foundations", teaches: ["docker", "kubernetes", "ci-cd"] },
  { id: "combo-data-science-launch", title: "Data Science Launchpad", provider: "DataCraft Learning", level: "intermediate", hours: 40, url: "https://datacraft.io/courses/data-science-launch", teaches: ["data-analysis", "data-visualization", "statistics"] },
  { id: "combo-cloud-architect", title: "Cloud Architect Path (AWS)", provider: "CloudSkills Hub", level: "advanced", hours: 35, url: "https://cloudskills.dev/courses/cloud-architect-path", teaches: ["cloud-fundamentals", "cloud-architecture"] },
  { id: "combo-product-essentials", title: "Product Management Essentials", provider: "Systemwise", level: "beginner", hours: 12, url: "https://systemwise.io/courses/product-essentials", teaches: ["product-management", "agile-scrum"] },
  { id: "combo-frontend-design", title: "Design-Minded Frontend Development", provider: "PixelCraft Academy", level: "intermediate", hours: 22, url: "https://pixelcraft.design/courses/design-minded-frontend", teaches: ["ui-ux-design", "responsive-design", "frontend-frameworks"] },
];

export const courses: SeedCourse[] = [...primaryCourses, ...alternateCourses, ...comboCourses];
