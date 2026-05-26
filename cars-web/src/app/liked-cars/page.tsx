import Link from "next/link";
import DashboardAdCard from "../../components/dashboard-ad-card";
import { getCurrentUser, requireAuth } from "../../lib/auth";
import { getLikedAds } from "../../services/ads";

export default async function LikedCarsPage() {
  await requireAuth();

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const likedAds = await getLikedAds(user.id);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              Liked cars
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Cars you liked
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Your saved liked ads are collected here.
            </p>
          </div>
          <Link
            href="/ads"
            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
          >
            Browse ads
          </Link>
        </div>
      </div>

      {likedAds.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {likedAds.map((ad) => (
            <DashboardAdCard
              key={ad.id}
              ad={ad}
              canDelete={user.userType === "admin" || user.id === ad.ownerId}
              canLike={user.userType !== "admin" && user.id !== ad.ownerId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
          You have not liked any cars yet.
        </div>
      )}
    </section>
  );
}
