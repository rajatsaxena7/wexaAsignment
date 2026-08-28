import { NextResponse } from "next/server";
import { listRoles } from "@/lib/queries/roles";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const roles = await listRoles();
    return NextResponse.json({ roles });
  } catch (err) {
    return handleApiError(err);
  }
}
