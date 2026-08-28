"use client";

import { useKnownSkills } from "@/hooks/useKnownSkills";
import { RequiredSkill } from "@/lib/types";

export default function RoleGapSummary({ requiredSkills }: { requiredSkills: RequiredSkill[] }) {
  const { knownIds } = useKnownSkills();

  const core = requiredSkills.filter((r) => r.importance === "core");
  const knownCore = core.filter((r) => knownIds.includes(r.skill.id));

  if (knownIds.length === 0) {
    return (
      <p className="text-sm text-muted">
        You haven&apos;t added any known skills yet — the roadmap will start from scratch.
      </p>
    );
  }

  if (core.length > 0 && knownCore.length === core.length) {
    return <p className="text-sm font-medium text-success">You already know every core skill for this role.</p>;
  }

  return (
    <p className="text-sm text-muted">
      You already know{" "}
      <span className="font-medium text-foreground">
        {knownCore.length} of {core.length}
      </span>{" "}
      core skills for this role.
    </p>
  );
}
