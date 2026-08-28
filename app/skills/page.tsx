import { listSkills } from "@/lib/queries/skills";
import { ErrorState } from "@/components/States";
import { Skill } from "@/lib/types";
import SkillsBrowser from "./SkillsBrowser";

export const metadata = { title: "Skills — LearnPath" };
export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  let skills: Skill[] | undefined;
  let error: string | undefined;
  try {
    skills = await listSkills();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (!skills) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <ErrorState detail={error} />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="mt-1 text-sm text-muted">
          {skills.length} skills in the graph. Open one to see its prerequisites, what it unlocks, and
          the courses that teach it.
        </p>
      </div>
      <SkillsBrowser skills={skills} />
    </main>
  );
}
