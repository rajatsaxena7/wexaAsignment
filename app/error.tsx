"use client";

import { ErrorState } from "@/components/States";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred while rendering this page."
        detail={error.message}
        onRetry={reset}
      />
    </main>
  );
}
