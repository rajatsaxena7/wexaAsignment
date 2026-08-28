"use client";

import { useMemo, useState } from "react";
import { Skill } from "@/lib/types";

function useFilteredOptions(allSkills: Skill[], query: string, excludeIds: string[]) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSkills
      .filter((s) => !excludeIds.includes(s.id))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
      .slice(0, 40);
  }, [allSkills, query, excludeIds]);
}

export function SkillMultiPicker({
  allSkills,
  selectedIds,
  onChange,
  excludeIds = [],
  placeholder = "Search skills…",
}: {
  allSkills: Skill[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  excludeIds?: string[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = allSkills.filter((s) => selectedIds.includes(s.id));
  const options = useFilteredOptions(allSkills, query, excludeIds);

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface p-2 focus-within:ring-2 focus-within:ring-primary/30">
        {selected.map((s) => (
          <span
            key={s.id}
            className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {s.name}
            <button
              type="button"
              onClick={() => onChange(selectedIds.filter((id) => id !== s.id))}
              className="ml-0.5 leading-none text-primary/70 hover:text-primary"
              aria-label={`Remove ${s.name}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          aria-label={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={selected.length ? "Add another…" : placeholder}
          className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted"
        />
      </div>
      {open && options.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {options.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(
                      isSelected ? selectedIds.filter((id) => id !== s.id) : [...selectedIds, s.id],
                    );
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-muted ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                      aria-hidden
                    >
                      {isSelected && "✓"}
                    </span>
                    {s.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted">{s.category}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SkillSinglePicker({
  allSkills,
  selectedId,
  onChange,
  excludeIds = [],
  placeholder = "Search for a skill…",
}: {
  allSkills: Skill[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  excludeIds?: string[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = allSkills.find((s) => s.id === selectedId) ?? null;
  const options = useFilteredOptions(allSkills, query, excludeIds);

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5">
        <div>
          <p className="text-sm font-medium text-primary">{selected.name}</p>
          <p className="text-xs text-muted">{selected.category}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-full px-2.5 py-1 text-xs font-medium text-muted hover:bg-surface-muted hover:text-foreground"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-primary/30"
      />
      {open && options.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {options.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(s.id);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-muted"
              >
                <span>{s.name}</span>
                <span className="shrink-0 text-xs text-muted">{s.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
