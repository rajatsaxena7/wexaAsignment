export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: string;
  title: string;
  provider: string;
  level: CourseLevel;
  hours: number;
  url: string;
}

export interface Role {
  id: string;
  title: string;
  category: string;
  description: string;
}

export type SkillImportance = "core" | "nice-to-have";

export interface RequiredSkill {
  skill: Skill;
  importance: SkillImportance;
}

export interface SkillDetail extends Skill {
  prerequisites: Skill[];
  unlocks: Skill[];
  related: Skill[];
  courses: Course[];
}

export interface CourseDetail extends Course {
  teaches: Skill[];
  alsoConsider: Course[];
}

export interface RoleDetail extends Role {
  requiredSkills: RequiredSkill[];
}

export interface RoadmapStep {
  skill: Skill;
  alreadyKnown: boolean;
  unlockedBy: string[];
  course: Course | null;
}

export interface PlanResult {
  steps: RoadmapStep[];
  totalHours: number;
  totalCourses: number;
  shortestHops: number | null;
  alreadyMet: boolean;
}

export interface FoundationalSkill {
  skill: Skill;
  unlocks: number;
}
