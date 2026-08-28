import { NextResponse } from "next/server";
import { DatabaseUnavailableError } from "./db";

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof DatabaseUnavailableError) {
    return NextResponse.json({ error: err.message, code: "DATABASE_UNAVAILABLE" }, { status: 503 });
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}
