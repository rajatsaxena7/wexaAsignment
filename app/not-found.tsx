import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">We couldn&apos;t find that.</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The skill, role, or course you&apos;re looking for doesn&apos;t exist in the graph.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Back to home
      </Link>
    </main>
  );
}
