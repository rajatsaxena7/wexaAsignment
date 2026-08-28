"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchJson, ApiError } from "@/lib/api-client";
import { PlanResult, Role, Skill } from "@/lib/types";
import { useKnownSkills } from "@/hooks/useKnownSkills";
import { SkillMultiPicker, SkillSinglePicker } from "@/components/SkillPicker";
import { PlanSummary, RoadmapTimeline } from "@/components/RoadmapTimeline";
import { ErrorState } from "@/components/States";
import { examples, PathExample } from "@/lib/examples";

type GoalMode = "skill" | "role";

export default function PlanClient() {
  const params = useSearchParams();
  const { knownIds, setKnownIds } = useKnownSkills();

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const [mode, setMode] = useState<GoalMode>(params.get("role") ? "role" : "skill");
  const [goalSkillId, setGoalSkillId] = useState<string | null>(params.get("goal"));
  const [goalRoleId, setGoalRoleId] = useState<string | null>(params.get("role"));

  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // catalogLoading already starts true; no need to set it again here.
    Promise.all([
      fetchJson<{ skills: Skill[] }>("/api/skills"),
      fetchJson<{ roles: Role[] }>("/api/roles"),
    ])
      .then(([s, r]) => {
        if (cancelled) return;
        setAllSkills(s.skills);
        setAllRoles(r.roles);
        setCatalogError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setCatalogError(err instanceof Error ? err.message : "Failed to load the catalog.");
      })
      .finally(() => !cancelled && setCatalogLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const goalReady = mode === "skill" ? !!goalSkillId : !!goalRoleId;

  // Accepts overrides so a one-click example can set state and submit in the
  // same action, without waiting a render cycle for React state to settle.
  async function generatePlan(overrides?: {
    knownIds?: string[];
    mode?: GoalMode;
    goalSkillId?: string | null;
    goalRoleId?: string | null;
  }) {
    const effMode = overrides?.mode ?? mode;
    const effKnown = overrides?.knownIds ?? knownIds;
    const effGoalSkillId = overrides?.goalSkillId ?? goalSkillId;
    const effGoalRoleId = overrides?.goalRoleId ?? goalRoleId;
    if (effMode === "skill" ? !effGoalSkillId : !effGoalRoleId) return;

    setPlanLoading(true);
    setPlanError(null);
    setHasSubmitted(true);
    try {
      const body =
        effMode === "skill"
          ? { knownSkillIds: effKnown, goalSkillId: effGoalSkillId }
          : { knownSkillIds: effKnown, roleId: effGoalRoleId };
      const { plan } = await fetchJson<{ plan: PlanResult }>("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setPlan(plan);
    } catch (err) {
      setPlan(null);
      setPlanError(err instanceof ApiError ? err.message : "Something went wrong generating your plan.");
    } finally {
      setPlanLoading(false);
    }
  }

  function applyExample(example: PathExample) {
    setKnownIds(example.knownSkillIds);
    setMode(example.goal.type);
    setGoalSkillId(example.goal.type === "skill" ? example.goal.id : null);
    setGoalRoleId(example.goal.type === "role" ? example.goal.id : null);
    generatePlan({
      knownIds: example.knownSkillIds,
      mode: example.goal.type,
      goalSkillId: example.goal.type === "skill" ? example.goal.id : null,
      goalRoleId: example.goal.type === "role" ? example.goal.id : null,
    });
  }

  const goalLabel = useMemo(() => {
    if (mode === "skill") return allSkills.find((s) => s.id === goalSkillId)?.name;
    return allRoles.find((r) => r.id === goalRoleId)?.title;
  }, [mode, goalSkillId, goalRoleId, allSkills, allRoles]);

  if (catalogError) {
    return <ErrorState detail={catalogError} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold">1. What do you already know?</h2>
          <p className="mt-1 text-xs text-muted">
            Optional, but the roadmap and shortest-path distance are both built around this.
          </p>
          <div className="mt-3">
            {catalogLoading ? (
              <div className="h-11 animate-pulse-soft rounded-xl bg-surface-muted" />
            ) : (
              <SkillMultiPicker allSkills={allSkills} selectedIds={knownIds} onChange={setKnownIds} />
            )}
          </div>
          {knownIds.length > 0 && (
            <button
              onClick={() => setKnownIds([])}
              className="mt-2 text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold">2. Where do you want to go?</h2>
          <div className="mt-3 inline-flex rounded-full bg-surface-muted p-1 text-xs font-medium">
            {(["skill", "role"] as GoalMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {m === "skill" ? "A specific skill" : "A job role"}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {catalogLoading ? (
              <div className="h-11 animate-pulse-soft rounded-xl bg-surface-muted" />
            ) : mode === "skill" ? (
              <SkillSinglePicker
                allSkills={allSkills}
                selectedId={goalSkillId}
                onChange={setGoalSkillId}
                excludeIds={knownIds}
              />
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {allRoles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setGoalRoleId(r.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      goalRoleId === r.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-surface-muted"
                    }`}
                  >
                    <span className="font-medium">{r.title}</span>
                    <span className="block text-xs text-muted">{r.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <button
          onClick={() => generatePlan()}
          disabled={!goalReady || planLoading}
          className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {planLoading ? "Building your roadmap…" : "Generate roadmap"}
        </button>
      </div>

      <div>
        {!hasSubmitted && (
          <div className="rounded-2xl border border-dashed border-border p-6">
            <p className="text-sm text-muted">
              Pick what you know and a goal on the left — or jump straight into a working example:
            </p>
            <div className="mt-4 space-y-3">
              {examples.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => applyExample(ex)}
                  disabled={catalogLoading}
                  className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <p className="text-sm font-medium">{ex.title}</p>
                  <p className="mt-1 text-xs text-muted">{ex.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {planLoading && (
          <div className="space-y-3">
            <div className="h-20 animate-pulse-soft rounded-2xl bg-surface-muted" />
            <div className="h-20 animate-pulse-soft rounded-2xl bg-surface-muted" />
            <div className="h-20 animate-pulse-soft rounded-2xl bg-surface-muted" />
          </div>
        )}

        {!planLoading && planError && <ErrorState detail={planError} onRetry={generatePlan} />}

        {!planLoading && !planError && plan && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">
                Roadmap to {goalLabel ?? "your goal"}
              </h2>
              <p className="text-sm text-muted">
                Ordered so every prerequisite comes before what depends on it.
              </p>
            </div>
            <PlanSummary plan={plan} />
            <RoadmapTimeline plan={plan} />
          </div>
        )}
      </div>
    </div>
  );
}
