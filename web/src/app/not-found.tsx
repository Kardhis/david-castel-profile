import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
        404
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
        Esta página no existe. / This page does not exist.
      </p>
      <div className="mt-8 flex gap-4 text-base font-medium text-sky-400 sm:text-lg">
        <Link href="/es" className="hover:text-sky-300">
          ES
        </Link>
        <span className="text-zinc-600" aria-hidden>
          |
        </span>
        <Link href="/en" className="hover:text-sky-300">
          EN
        </Link>
      </div>
    </div>
  );
}
