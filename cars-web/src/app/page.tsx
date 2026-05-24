import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-4xl items-center justify-center px-4 sm:px-6">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-600">
          Welcome to Cars App
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Discover featured car ads and manage your account.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Sign in to explore sample car listings, leave comments, and see how the public app navigation works with responsive layout.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex w-full justify-center rounded-2xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 sm:w-auto"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex w-full justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}
