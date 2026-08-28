import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillDetail } from "@/lib/queries/skills";
import { EmptyState, ErrorState } from "@/components/States";
import { CategoryBadge, LevelBadge } from "@/components/Badge";
import { SkillDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${id} — LearnPath` };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let skill: SkillDetail | null = null;
  let error: string | undefined;
  try {
    skill = await getSkillDetail(id);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState detail={error} />
      </main>
    );
  }
  if (!skill) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/skills" className="text-sm text-muted hover:text-foreground">
        ← All skills
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <CategoryBadge category={skill.category} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{skill.name}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{skill.description}</p>
        </div>
        <Link
          href={`/plan?goal=${skill.id}`}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Plan a path to this skill
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Prerequisite chain</h2>
        <div className="mt-3 grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-3">
          <SkillColumn
            title="Requires first"
            skills={skill.prerequisites}
            empty="No prerequisites — a great starting point."
          />
          <div className="flex flex-col items-center justify-center rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-xs font-medium text-primary">This skill</p>
            <p className="mt-1 text-sm font-semibold">{skill.name}</p>
          </div>
          <SkillColumn
            title="Unlocks next"
            skills={skill.unlocks}
            empty="Nothing in the graph currently builds on this."
            align="right"
          />
        </div>
      </section>

      {skill.related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Related skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skill.related.map((r) => (
              <Link
                key={r.id}
                href={`/skills/${r.id}`}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:border-primary/40"
              >
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Courses that teach this</h2>
        {skill.courses.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No course yet"
              description="This skill isn't covered by a course in the catalog yet — try a related skill above."
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {skill.courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-0.5 text-xs text-muted">{c.provider}</p>
                <div className="mt-2 flex items-center gap-2">
                  <LevelBadge level={c.level} />
                  <span className="text-xs text-muted">{c.hours} hrs</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function SkillColumn({
  title,
  skills,
  empty,
  align = "left",
}: {
  title: string;
  skills: { id: string; name: string }[];
  empty: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "sm:text-right" : undefined}>
      <p className="text-xs font-medium text-muted">{title}</p>
      {skills.length === 0 ? (
        <p className="mt-2 text-xs text-muted/80">{empty}</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {skills.map((s) => (
            <li key={s.id}>
              <Link
                href={`/skills/${s.id}`}
                className="text-sm text-foreground hover:text-primary hover:underline underline-offset-4"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
