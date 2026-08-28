import { NextRequest, NextResponse } from "next/server";
import { listSkills } from "@/lib/queries/skills";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") ?? "";
    const skills = await listSkills(q);
    return NextResponse.json({ skills });
  } catch (err) {
    return handleApiError(err);
  }
}
