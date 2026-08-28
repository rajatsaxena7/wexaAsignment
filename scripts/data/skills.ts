export interface SeedSkill {
  id: string;
  name: string;
  category: string;
  description: string;
  /** IDs of skills this one depends on — i.e. this skill REQUIRES them first. */
  requires?: string[];
  /** IDs of loosely-related skills worth exploring sideways (declared once per pair). */
  relatedTo?: string[];
}

export const CATEGORIES = [
  "Foundations",
  "Programming",
  "Web Development",
  "Databases & Systems",
  "Data & Statistics",
  "Machine Learning",
  "Data Engineering",
  "Cloud & DevOps",
  "Product & Analytics",
  "Mobile",
] as const;

export const skills: SeedSkill[] = [
  // Foundations
  { id: "math-basics", name: "Arithmetic & Algebra Basics", category: "Foundations", description: "Core numeracy and algebraic manipulation used throughout technical work." },
  { id: "calculus", name: "Calculus", category: "Foundations", description: "Rates of change and accumulation — derivatives, integrals, and their use in optimization.", requires: ["math-basics"] },
  { id: "linear-algebra", name: "Linear Algebra", category: "Foundations", description: "Vectors, matrices, and transformations that underpin graphics, ML, and simulation.", requires: ["math-basics"] },
  { id: "statistics", name: "Statistics & Probability", category: "Foundations", description: "Describing uncertainty and drawing conclusions from data.", requires: ["math-basics"] },
  { id: "discrete-math", name: "Discrete Mathematics", category: "Foundations", description: "Logic, sets, graphs, and combinatorics — the math behind algorithms.", requires: ["math-basics"] },

  // Programming
  { id: "prog-fundamentals", name: "Programming Fundamentals", category: "Programming", description: "Variables, control flow, and functions — the building blocks of any program." },
  { id: "data-structures", name: "Data Structures", category: "Programming", description: "Arrays, lists, trees, and hash maps, and how their shape affects performance.", requires: ["prog-fundamentals"] },
  { id: "algorithms", name: "Algorithms", category: "Programming", description: "Systematic techniques for solving problems efficiently: sorting, searching, and graph traversal.", requires: ["data-structures", "discrete-math"] },
  { id: "oop", name: "Object-Oriented Programming", category: "Programming", description: "Modeling problems with classes, objects, and encapsulated state and behavior.", requires: ["prog-fundamentals"] },
  { id: "python", name: "Python Programming", category: "Programming", description: "A general-purpose language widely used for scripting, data work, and backend services.", requires: ["prog-fundamentals"] },
  { id: "git-version-control", name: "Git & Version Control", category: "Programming", description: "Tracking, branching, and collaborating on changes to a codebase safely.", requires: ["prog-fundamentals"] },
  { id: "linux-cli", name: "Linux & Command Line", category: "Programming", description: "Navigating, scripting, and managing systems from the terminal." },

  // Databases & Systems
  { id: "sql-basics", name: "SQL Fundamentals", category: "Databases & Systems", description: "Querying and shaping relational data with SELECT, JOIN, and aggregation.", requires: ["prog-fundamentals"] },
  { id: "databases", name: "Database Design", category: "Databases & Systems", description: "Modeling data with schemas, keys, normalization, and indexes.", requires: ["sql-basics"] },
  { id: "system-design", name: "System Design", category: "Databases & Systems", description: "Architecting systems that scale: caching, partitioning, and trade-off analysis.", requires: ["data-structures", "databases"] },

  // Web Development
  { id: "html-css", name: "HTML & CSS", category: "Web Development", description: "Structuring and styling content for the web." },
  { id: "javascript", name: "JavaScript", category: "Web Development", description: "The language of interactive web pages, running in the browser and beyond.", requires: ["html-css", "prog-fundamentals"] },
  { id: "ui-ux-design", name: "UI/UX Design Fundamentals", category: "Web Development", description: "Designing interfaces that are usable, accessible, and pleasant." },
  { id: "responsive-design", name: "Responsive Web Design", category: "Web Development", description: "Layouts that adapt gracefully across screen sizes and devices.", requires: ["html-css", "ui-ux-design"] },
  { id: "frontend-frameworks", name: "Frontend Frameworks (React)", category: "Web Development", description: "Building component-based, stateful user interfaces.", requires: ["javascript"] },
  { id: "nodejs", name: "Node.js", category: "Web Development", description: "Running JavaScript outside the browser to build servers and tools.", requires: ["javascript"] },
  { id: "backend-apis", name: "Backend API Development", category: "Web Development", description: "Designing and building HTTP services that read and write persistent data.", requires: ["oop", "databases"] },
  { id: "fullstack", name: "Full-Stack Web Development", category: "Web Development", description: "Connecting a frontend, backend, and database into one working application.", requires: ["frontend-frameworks", "backend-apis"] },

  // Data & Statistics
  { id: "data-analysis", name: "Data Analysis with Python", category: "Data & Statistics", description: "Cleaning, transforming, and summarizing data with pandas-style tooling.", requires: ["python", "statistics"] },
  { id: "data-visualization", name: "Data Visualization", category: "Data & Statistics", description: "Turning data into charts that communicate a finding clearly.", requires: ["data-analysis"] },

  // Machine Learning
  { id: "machine-learning", name: "Machine Learning", category: "Machine Learning", description: "Training models that learn patterns from data rather than explicit rules.", requires: ["statistics", "linear-algebra", "python"] },
  { id: "deep-learning", name: "Deep Learning", category: "Machine Learning", description: "Neural networks with many layers, trained on large datasets.", requires: ["machine-learning", "linear-algebra"] },
  { id: "nlp", name: "Natural Language Processing", category: "Machine Learning", description: "Teaching models to understand and generate human language.", requires: ["deep-learning"] },
  { id: "computer-vision", name: "Computer Vision", category: "Machine Learning", description: "Extracting meaning from images and video with learned models.", requires: ["deep-learning"] },
  { id: "ml-ops", name: "MLOps", category: "Machine Learning", description: "Deploying, monitoring, and retraining machine learning models reliably.", requires: ["machine-learning", "docker", "cloud-fundamentals"] },

  // Data Engineering
  { id: "data-engineering", name: "Data Engineering", category: "Data Engineering", description: "Building pipelines that move and transform data reliably at scale.", requires: ["sql-basics", "python", "databases"] },
  { id: "big-data", name: "Big Data Processing (Spark)", category: "Data Engineering", description: "Processing datasets too large for a single machine.", requires: ["data-engineering"] },
  { id: "data-warehousing", name: "Data Warehousing", category: "Data Engineering", description: "Modeling and storing data for fast, large-scale analytical queries.", requires: ["databases", "sql-basics"] },

  // Cloud & DevOps
  { id: "cloud-fundamentals", name: "Cloud Computing Fundamentals", category: "Cloud & DevOps", description: "Core concepts behind on-demand compute, storage, and networking." },
  { id: "docker", name: "Docker & Containers", category: "Cloud & DevOps", description: "Packaging an application with everything it needs to run consistently anywhere.", requires: ["linux-cli"] },
  { id: "kubernetes", name: "Kubernetes", category: "Cloud & DevOps", description: "Orchestrating containers across a cluster of machines.", requires: ["docker"] },
  { id: "ci-cd", name: "CI/CD Pipelines", category: "Cloud & DevOps", description: "Automatically testing and shipping code changes.", requires: ["git-version-control", "docker"] },
  { id: "devops", name: "DevOps Practices", category: "Cloud & DevOps", description: "Combining development and operations to ship reliably and often.", requires: ["ci-cd", "cloud-fundamentals"] },
  { id: "cloud-architecture", name: "Cloud Architecture (AWS)", category: "Cloud & DevOps", description: "Designing production systems using managed cloud services.", requires: ["cloud-fundamentals", "system-design"] },
  { id: "infra-as-code", name: "Infrastructure as Code (Terraform)", category: "Cloud & DevOps", description: "Defining and provisioning infrastructure through versioned configuration.", requires: ["cloud-architecture", "linux-cli"] },

  // Product & Analytics
  { id: "excel", name: "Spreadsheet & Excel Skills", category: "Product & Analytics", description: "Organizing, formulating, and analyzing data in a spreadsheet." },
  { id: "business-analytics", name: "Business Analytics", category: "Product & Analytics", description: "Using data to inform business decisions and measure outcomes.", requires: ["excel", "statistics"] },
  { id: "product-management", name: "Product Management Fundamentals", category: "Product & Analytics", description: "Defining what to build and why, balancing users, business, and feasibility." },
  { id: "agile-scrum", name: "Agile & Scrum", category: "Product & Analytics", description: "Iterative planning and delivery in short, inspectable cycles." },
  { id: "product-strategy", name: "Product Strategy", category: "Product & Analytics", description: "Setting direction and prioritizing a roadmap around measurable goals.", requires: ["product-management", "business-analytics"] },

  // Mobile
  { id: "mobile-dev", name: "Mobile App Development", category: "Mobile", description: "Building native applications for phones and tablets.", requires: ["oop"] },
  { id: "react-native", name: "Cross-Platform Mobile (React Native)", category: "Mobile", description: "Sharing one codebase across iOS and Android using web technologies.", requires: ["frontend-frameworks", "mobile-dev"] },
];

export const relatedPairs: [string, string][] = [
  ["python", "javascript"],
  ["machine-learning", "data-engineering"],
  ["frontend-frameworks", "ui-ux-design"],
  ["cloud-architecture", "devops"],
  ["statistics", "business-analytics"],
  ["data-visualization", "business-analytics"],
  ["computer-vision", "nlp"],
  ["sql-basics", "excel"],
  ["product-management", "agile-scrum"],
  ["deep-learning", "big-data"],
  ["system-design", "cloud-architecture"],
  ["data-analysis", "data-engineering"],
  ["responsive-design", "mobile-dev"],
  ["kubernetes", "infra-as-code"],
  ["algorithms", "system-design"],
  ["git-version-control", "ci-cd"],
];
