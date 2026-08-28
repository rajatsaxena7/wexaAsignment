import Link from "next/link";
import { listRoles } from "@/lib/queries/roles";
import { ErrorState } from "@/components/States";
import { Role } from "@/lib/types";

export const metadata = { title: "Roles — LearnPath" };
export const dynamic = "force-dynamic";

export default async function RolesPage() {
  let roles: Role[] | undefined;
  let error: string | undefined;
  try {
    roles = await listRoles();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (!roles) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState detail={error} />
      </main>
    );
  }

  const byCategory = new Map<string, typeof roles>();
  for (const role of roles) {
    byCategory.set(role.category, [...(byCategory.get(role.category) ?? []), role]);
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Target roles</h1>
        <p className="mt-1 text-sm text-muted">
          Each role requires a set of skills. Open one to see the gap between what it needs and what you
          already know, and get a roadmap to close it.
        </p>
      </div>

      <div className="space-y-8">
        {[...byCategory.entries()].map(([category, roles]) => (
          <section key={category}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{category}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((r) => (
                <Link
                  key={r.id}
                  href={`/roles/${r.id}`}
                  className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                >
                  <h3 className="text-sm font-medium">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
