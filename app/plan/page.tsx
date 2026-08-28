import { Suspense } from "react";
import PlanClient from "./PlanClient";

export const metadata = { title: "Plan a path — LearnPath" };

export default function PlanPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">Plan your path</h1>
        <p className="mt-1 text-sm text-muted">
          Select what you already know and where you want to end up. LearnPath walks the prerequisite
          graph between the two and orders the result so nothing comes before its dependency.
        </p>
      </div>

      <ol className="mb-8 grid gap-3 sm:grid-cols-3">
        <Step n={1} text="Add the skills you already have (or skip this if you're starting from zero)" />
        <Step n={2} text="Pick a goal — a specific skill, or a job role" />
        <Step n={3} text="Get an ordered roadmap: a course for every step, and the shortest route there" />
      </ol>
      <Suspense fallback={<div className="h-64 animate-pulse-soft rounded-2xl bg-surface-muted" />}>
        <PlanClient />
      </Suspense>
    </main>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {n}
      </span>
      <p className="text-sm text-muted">{text}</p>
    </li>
  );
}
