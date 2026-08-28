import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoleDetail } from "@/lib/queries/roles";
import { ErrorState } from "@/components/States";
import { ImportanceBadge } from "@/components/Badge";
import { RoleDetail } from "@/lib/types";
import RoleGapSummary from "@/components/RoleGapSummary";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${id} — LearnPath` };
}

export default async function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let role: RoleDetail | null = null;
  let error: string | undefined;
  try {
    role = await getRoleDetail(id);
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
  if (!role) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/roles" className="text-sm text-muted hover:text-foreground">
        ← All roles
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{role.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{role.description}</p>
        </div>
        <Link
          href={`/plan?role=${role.id}`}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Build my path to this role
        </Link>
      </div>

      <div className="mt-4">
        <RoleGapSummary requiredSkills={role.requiredSkills} />
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Required skills</h2>
        <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
          {role.requiredSkills.map((r) => (
            <li key={r.skill.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <Link
                href={`/skills/${r.skill.id}`}
                className="text-sm hover:text-primary hover:underline underline-offset-4"
              >
                {r.skill.name}
              </Link>
              <ImportanceBadge importance={r.importance} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
