import Link from "next/link";
import DashboardAdCard from "../../components/dashboard-ad-card";
import { getCurrentUser, requireAuth } from "../../lib/auth";
import { getLatestAds } from "../../services/ads";

export default async function DashboardPage() {
  await requireAuth();

  const [user, latestAds] = await Promise.all([
    getCurrentUser(),
    getLatestAds(3),
  ]);

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-3 text-base text-slate-600">
          You are logged in as {user?.email}.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-950">
            Last three added ads
          </h2>
          <Link
            href="/ads/new"
            className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            New ad
          </Link>
        </div>

        {latestAds.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestAds.map((ad) => (
              <DashboardAdCard
                key={ad.id}
                ad={ad}
                canDelete={user?.userType === "admin" || user?.id === ad.ownerId}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
            No ads have been added yet.
          </div>
        )}
      </div>
    </section>
  );
}
