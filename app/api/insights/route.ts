import { NextResponse } from "next/server";
import { getFoundationalSkills, getGraphStats } from "@/lib/queries/insights";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const [foundational, stats] = await Promise.all([getFoundationalSkills(10), getGraphStats()]);
    return NextResponse.json({ foundational, stats });
  } catch (err) {
    return handleApiError(err);
  }
}
