import { NextResponse } from "next/server";
import { getRoleDetail } from "@/lib/queries/roles";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const role = await getRoleDetail(id);
    if (!role) return NextResponse.json({ error: "Role not found." }, { status: 404 });
    return NextResponse.json({ role });
  } catch (err) {
    return handleApiError(err);
  }
}
