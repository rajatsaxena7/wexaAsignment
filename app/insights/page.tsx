import Link from "next/link";
import { getFoundationalSkills, getGraphStats, GraphStats } from "@/lib/queries/insights";
import { ErrorState } from "@/components/States";
import { CategoryBadge } from "@/components/Badge";
import { FoundationalSkill } from "@/lib/types";

export const metadata = { title: "Insights — LearnPath" };
export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  let foundational: FoundationalSkill[] | undefined;
  let stats: GraphStats | undefined;
  let error: string | undefined;
  try {
    [foundational, stats] = await Promise.all([getFoundationalSkills(10), getGraphStats()]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (!foundational || !stats) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState detail={error} />
      </main>
    );
  }

  const maxUnlocks = Math.max(1, ...foundational.map((f) => f.unlocks));

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-sm text-muted">
          Computed live from the graph — no separate analytics pipeline.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat label="Skills" value={stats.skills} />
        <Stat label="Prerequisite links" value={stats.prerequisiteLinks} />
        <Stat label="Courses" value={stats.courses} />
        <Stat label="Roles" value={stats.roles} />
        <Stat label="Longest chain" value={stats.longestChain} hint="hops" />
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Most foundational skills
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ranked by how many other skills transitively require them — a single variable-length
          traversal per skill, computed on demand.
        </p>

        <ol className="mt-5 space-y-3">
          {foundational.map((f, i) => (
            <li key={f.skill.id}>
              <Link
                href={`/skills/${f.skill.id}`}
                className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-muted">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{f.skill.name}</span>
                    <CategoryBadge category={f.skill.category} />
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    {f.unlocks} skill{f.unlocks === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, (f.unlocks / maxUnlocks) * 100)}%` }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-center">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted">{label}</p>
      {hint && <p className="text-[11px] text-muted/70">{hint}</p>}
    </div>
  );
}
