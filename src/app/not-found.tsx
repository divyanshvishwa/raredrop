import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <p className="mt-4 text-sm text-gray-500">This piece doesn&apos;t exist.</p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity"
      >
        Back to Shop
        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
      </Link>
    </div>
  );
}
