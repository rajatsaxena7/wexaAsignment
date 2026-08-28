import Link from "next/link";
import { PlanResult } from "@/lib/types";
import { LevelBadge } from "./Badge";
import { EmptyState } from "./States";

function formatHours(hours: number) {
  if (hours === 0) return "0 hrs";
  if (hours < 1) return "< 1 hr";
  return `${hours} hr${hours === 1 ? "" : "s"}`;
}

export function PlanSummary({ plan }: { plan: PlanResult }) {
  const toLearn = plan.steps.filter((s) => !s.alreadyKnown);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryStat label="Skills to learn" value={String(toLearn.length)} />
      <SummaryStat label="Recommended courses" value={String(plan.totalCourses)} />
      <SummaryStat label="Estimated time" value={formatHours(plan.totalHours)} />
      <SummaryStat
        label="Shortest path"
        value={plan.shortestHops === null ? "—" : `${plan.shortestHops} hop${plan.shortestHops === 1 ? "" : "s"}`}
        hint={plan.shortestHops === null ? "from a skill you know" : undefined}
      />
    </div>
  );
}

function SummaryStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
      {hint && <p className="text-[11px] text-muted/70">{hint}</p>}
    </div>
  );
}

export function RoadmapTimeline({ plan }: { plan: PlanResult }) {
  if (plan.alreadyMet) {
    return (
      <EmptyState
        icon="✓"
        title="You already have this covered"
        description="Every skill in this goal is already in your known-skills list. Pick a different goal to see a roadmap."
      />
    );
  }

  if (plan.steps.length === 0) {
    return (
      <EmptyState
        title="No roadmap to show yet"
        description="Choose a goal skill or role above to generate a roadmap."
      />
    );
  }

  return (
    <ol className="relative border-l border-border pl-6">
      {plan.steps.map((step, i) => (
        <li key={step.skill.id} className="relative pb-8 last:pb-0">
          <span
            className={`absolute -left-[29px] flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-4 ring-background ${
              step.alreadyKnown
                ? "bg-success-bg text-success"
                : "bg-primary text-primary-foreground"
            }`}
            aria-hidden
          >
            {step.alreadyKnown ? "✓" : i + 1}
          </span>

          <div
            className={`rounded-2xl border p-4 ${
              step.alreadyKnown ? "border-border bg-surface-muted/60" : "border-border bg-surface"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/skills/${step.skill.id}`}
                className="font-medium hover:text-primary hover:underline underline-offset-4"
              >
                {step.skill.name}
              </Link>
              {step.alreadyKnown ? (
                <span className="text-xs font-medium text-success">Already known</span>
              ) : (
                <span className="text-xs text-muted">{step.skill.category}</span>
              )}
            </div>

            {!step.alreadyKnown && (
              <div className="mt-3">
                {step.course ? (
                  <a
                    href={step.course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-1.5 rounded-xl border border-border bg-background p-3 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      <span className="block text-sm font-medium">{step.course.title}</span>
                      <span className="block text-xs text-muted">{step.course.provider}</span>
                    </span>
                    <span className="flex items-center gap-2 text-xs text-muted">
                      <LevelBadge level={step.course.level} />
                      {formatHours(step.course.hours)}
                    </span>
                  </a>
                ) : (
                  <p className="rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted">
                    No course in the catalog teaches this yet — see the skill page for related skills to
                    explore instead.
                  </p>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
