import { NextRequest, NextResponse } from "next/server";
import { planForGoal, planForRole } from "@/lib/queries/plan";
import { handleApiError } from "@/lib/api-helpers";

interface PlanRequestBody {
  knownSkillIds?: unknown;
  goalSkillId?: unknown;
  roleId?: unknown;
}

function parseKnownIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string").slice(0, 200);
}

export async function POST(req: NextRequest) {
  let body: PlanRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const knownSkillIds = parseKnownIds(body.knownSkillIds);
  const goalSkillId = typeof body.goalSkillId === "string" ? body.goalSkillId : undefined;
  const roleId = typeof body.roleId === "string" ? body.roleId : undefined;

  if (!goalSkillId && !roleId) {
    return NextResponse.json({ error: "Provide either goalSkillId or roleId." }, { status: 400 });
  }
  if (goalSkillId && roleId) {
    return NextResponse.json({ error: "Provide only one of goalSkillId or roleId." }, { status: 400 });
  }

  try {
    const plan = goalSkillId
      ? await planForGoal(knownSkillIds, goalSkillId)
      : await planForRole(knownSkillIds, roleId!);

    if (!plan) {
      return NextResponse.json(
        { error: goalSkillId ? "Goal skill not found." : "Role not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ plan });
  } catch (err) {
    return handleApiError(err);
  }
}
