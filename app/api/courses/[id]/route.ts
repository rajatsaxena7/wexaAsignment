import { NextResponse } from "next/server";
import { getCourseDetail } from "@/lib/queries/courses";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const course = await getCourseDetail(id);
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    return NextResponse.json({ course });
  } catch (err) {
    return handleApiError(err);
  }
}
