"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Skill } from "@/lib/types";
import { EmptyState } from "@/components/States";
import { CategoryBadge } from "@/components/Badge";

export default function SkillsBrowser({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(skills.map((s) => s.category))].sort(),
    [skills],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter(
      (s) =>
        (!category || s.category === category) &&
        (!q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
    );
  }, [skills, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills…"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-primary/30 sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === null ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === c ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No skills match" description="Try a different search term or category." />
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/skills/${s.id}`}
              className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium">{s.name}</h3>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted">{s.description}</p>
              <div className="mt-3">
                <CategoryBadge category={s.category} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
