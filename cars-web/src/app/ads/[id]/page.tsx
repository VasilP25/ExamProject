import Link from "next/link";
import { notFound } from "next/navigation";
import { toggleAdLikeAction } from "../../../lib/ad-actions";
import { getCurrentUser } from "../../../lib/auth";
import { getAdDetail, getCommentsForAd } from "../../../services/ads";

export default async function AdDetailPage({ params }: { params: { id: string } }) {
  const adId = Number(params.id);
  if (Number.isNaN(adId)) {
    notFound();
  }

  const user = await getCurrentUser();
  const [ad, comments] = await Promise.all([
    getAdDetail(adId, user?.id),
    user ? getCommentsForAd(adId) : Promise.resolve([]),
  ]);

  if (!ad) {
    notFound();
  }
  const canLike =
    Boolean(user) && user?.userType !== "admin" && user?.id !== ad.ownerId;

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              Ad details
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              {ad.name} {ad.model}
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Posted by {ad.ownerName}. Year: {ad.year}. Comments: {ad.commentCount}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ads"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Back to listings
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/ads/${ad.id}/download`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Download ad
                </Link>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-700">Car details</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Name:</span> {ad.name}
                </p>
                <p>
                  <span className="font-semibold">Model:</span> {ad.model}
                </p>
                <p>
                  <span className="font-semibold">Year:</span> {ad.year}
                </p>
                {user ? (
                  <>
                    <p>
                      <span className="font-semibold">Price:</span>{" "}
                      {ad.price.toLocaleString("en-US")} EUR
                    </p>
                    <p>
                      <span className="font-semibold">Comments:</span>{" "}
                      {ad.commentCount}
                    </p>
                  </>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="font-semibold">
                    {ad.likes} {ad.likes === 1 ? "like" : "likes"}
                  </p>
                  {canLike ? (
                    <form action={toggleAdLikeAction}>
                      <input type="hidden" name="adId" value={ad.id} />
                      <button
                        type="submit"
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          ad.isLikedByCurrentUser
                            ? "bg-sky-700 text-white hover:bg-sky-800"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {ad.isLikedByCurrentUser ? "Liked" : "Like"}
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {user ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-700">Comments</p>
              {comments.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="rounded-3xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {comment.ownerName}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {comment.text}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : "Unknown date"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                  No comments have been posted for this ad yet.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
