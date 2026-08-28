import { NextResponse } from "next/server";
import { checkConnection } from "@/lib/db";

export async function GET() {
  const result = await checkConnection();
  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
