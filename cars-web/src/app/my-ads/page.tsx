import Link from "next/link";
import DashboardAdCard from "../../components/dashboard-ad-card";
import { getCurrentUser, requireAuth } from "../../lib/auth";
import { getAdsByOwner } from "../../services/ads";

export default async function MyAdsPage() {
  await requireAuth();

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const myAds = await getAdsByOwner(user.id);
  const totalLikes = myAds.reduce((sum, ad) => sum + Number(ad.likes), 0);
  const totalComments = myAds.reduce(
    (sum, ad) => sum + Number(ad.commentCount),
    0,
  );

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              My ads
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Ads created by {user.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              View and manage every car ad you have posted.
            </p>
          </div>
          {user.userType !== "admin" ? (
            <Link
              href="/ads/new"
              className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              New ad
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
            Logged in user
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            {user.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          {user.userType === "admin" ? (
            <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              Admin
            </p>
          ) : null}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Created ads</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {myAds.length}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Likes / comments</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">
            {totalLikes} / {totalComments}
          </p>
        </div>
      </div>

      {myAds.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {myAds.map((ad) => (
            <DashboardAdCard
              key={ad.id}
              ad={ad}
              canDelete
              canLike={false}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
          You have not created any ads yet.
        </div>
      )}
    </section>
  );
}
