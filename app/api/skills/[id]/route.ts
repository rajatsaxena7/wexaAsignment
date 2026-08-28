import { NextResponse } from "next/server";
import { getSkillDetail } from "@/lib/queries/skills";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await getSkillDetail(id);
    if (!skill) return NextResponse.json({ error: "Skill not found." }, { status: 404 });
    return NextResponse.json({ skill });
  } catch (err) {
    return handleApiError(err);
  }
}
