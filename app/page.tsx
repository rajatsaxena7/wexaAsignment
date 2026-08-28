import Link from "next/link";
import { getGraphStats } from "@/lib/queries/insights";

export const dynamic = "force-dynamic";

async function loadStats() {
  try {
    return await getGraphStats();
  } catch {
    return null;
  }
}

export default async function Home() {
  const stats = await loadStats();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Backed by a graph database
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            The shortest real path from what you know to what you want to learn.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Tell LearnPath which skills you already have and where you want to go — a role or a single
            skill. It walks the prerequisite graph, skips what you already know, and hands back an
            ordered roadmap with a course for every step.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/plan"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Plan my path
            </Link>
            <Link
              href="/roles"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-muted"
            >
              Browse target roles
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted">
            No setup needed — the planner has one-click examples to try immediately.
          </p>
        </div>

        {stats && (
          <dl className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat value={stats.skills} label="skills mapped" />
            <Stat value={stats.prerequisiteLinks} label="prerequisite links" />
            <Stat value={stats.courses} label="courses cataloged" />
            <Stat value={stats.roles} label="target roles" />
          </dl>
        )}
      </section>

      <section className="border-t border-border bg-surface/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Why this needs a graph, not a table
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <FeatureCard
              title="Prerequisite chains, not fixed columns"
              body="Deep Learning needs Machine Learning needs Statistics needs Algebra. That chain can be 2 hops or 8 — a graph walks it directly, no schema changes and no stack of self-joins."
            />
            <FeatureCard
              title="Shortest path across many routes"
              body="There's often more than one way to a goal skill. LearnPath finds the fewest-hop route from anything you already know — a native graph operation, not a recursive CTE."
            />
            <FeatureCard
              title="What unlocks the most, at a glance"
              body="The Insights page ranks skills by how many others transitively depend on them — one variable-length traversal, computed live for every skill."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
