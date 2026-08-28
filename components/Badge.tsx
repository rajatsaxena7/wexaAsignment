import { ReactNode } from "react";

type Tone = "neutral" | "primary" | "success" | "warning" | "info" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted",
  primary: "bg-primary/10 text-primary",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-accent",
  info: "bg-info-bg text-primary",
  danger: "bg-danger-bg text-danger",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function ImportanceBadge({ importance }: { importance: "core" | "nice-to-have" }) {
  return importance === "core" ? (
    <Badge tone="primary">Core</Badge>
  ) : (
    <Badge tone="neutral">Nice to have</Badge>
  );
}

export function LevelBadge({ level }: { level: "beginner" | "intermediate" | "advanced" }) {
  const tone = level === "beginner" ? "success" : level === "advanced" ? "warning" : "info";
  const label = level[0].toUpperCase() + level.slice(1);
  return <Badge tone={tone}>{label}</Badge>;
}

export function CategoryBadge({ category }: { category: string }) {
  return <Badge tone="neutral">{category}</Badge>;
}
