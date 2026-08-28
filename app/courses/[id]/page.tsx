import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseDetail } from "@/lib/queries/courses";
import { ErrorState } from "@/components/States";
import { LevelBadge } from "@/components/Badge";
import { CourseDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${id} — LearnPath` };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let course: CourseDetail | null = null;
  let error: string | undefined;
  try {
    course = await getCourseDetail(id);
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
  if (!course) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/skills" className="text-sm text-muted hover:text-foreground">
        ← Skills
      </Link>

      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={course.level} />
          <span className="text-xs text-muted">{course.hours} hrs · {course.provider}</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{course.title}</h1>
        {course.url && (
          <a
            href={course.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            View course ↗
          </a>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Teaches</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {course.teaches.map((s) => (
            <Link
              key={s.id}
              href={`/skills/${s.id}`}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:border-primary/40"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {course.alsoConsider.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Also consider — overlapping skill coverage
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {course.alsoConsider.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-0.5 text-xs text-muted">{c.provider}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
