import Link from "next/link";
import { getCurrentUser } from "../../lib/auth";
import { getAds } from "../../services/ads";
import DashboardAdCard from "../../components/dashboard-ad-card";
import AdsFilterControls from "../../components/ads-filter-controls";

type SearchParams = {
  name?: string | string[];
  model?: string | string[];
  year?: string | string[];
  page?: string | string[];
};

function buildQuery(name: string, model: string, year: string, page: number) {
  const params = new URLSearchParams();

  if (name.trim()) {
    params.set("name", name.trim());
  }
  if (model.trim()) {
    params.set("model", model.trim());
  }
  if (year.trim()) {
    params.set("year", year.trim());
  }
  params.set("page", String(page));

  return `/ads?${params.toString()}`;
}

export default async function AdsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawName = Array.isArray(resolvedSearchParams?.name)
    ? resolvedSearchParams?.name[0]
    : resolvedSearchParams?.name;
  const rawModel = Array.isArray(resolvedSearchParams?.model)
    ? resolvedSearchParams?.model[0]
    : resolvedSearchParams?.model;
  const rawYear = Array.isArray(resolvedSearchParams?.year)
    ? resolvedSearchParams?.year[0]
    : resolvedSearchParams?.year;
  const rawPage = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams?.page[0]
    : resolvedSearchParams?.page;

  const name = rawName?.trim() ?? "";
  const model = rawModel?.trim() ?? "";
  const year = rawYear?.trim() ?? "";
  const page = Number(rawPage ?? "1") || 1;

  const user = await getCurrentUser();
  const pagination = await getAds(name, model, year, page, undefined, user?.id);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              Car listings
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Browse all ads
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Search for cars by name, model, or year. Only non-empty fields are applied, and ads must match all provided filters.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Home
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
              >
                Dashboard
              </Link>
            ) : null}
          </div>
        </div>

        <AdsFilterControls
          initialName={name}
          initialModel={model}
          initialYear={year}
        />
      </div>

      {pagination.ads.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pagination.ads.map((ad) => (
            <DashboardAdCard
              key={ad.id}
              ad={ad}
              canDelete={user?.userType === "admin" || user?.id === ad.ownerId}
              canLike={Boolean(user)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
          No car ads match your search. Try a different keyword or clear the search.
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 sm:flex-row">
        <p>
          Page {pagination.page} • {pagination.pageSize} ads per page
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {pagination.page > 1 ? (
            <Link
              href={buildQuery(name, model, year, pagination.page - 1)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
              Previous
            </span>
          )}
          {pagination.hasMore ? (
            <Link
              href={buildQuery(name, model, year, pagination.page + 1)}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex cursor-not-allowed rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
              Next
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
