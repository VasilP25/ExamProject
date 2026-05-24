import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdDetail, getCommentsForAd } from "../../../../services/ads";

export default async function AdCommentsPage({ params }: { params: { id: string } }) {
  const adId = Number(params.id);
  if (Number.isNaN(adId)) {
    notFound();
  }

  const [ad, comments] = await Promise.all([
    getAdDetail(adId),
    getCommentsForAd(adId),
  ]);

  if (!ad) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              Ad comments
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Comments for {ad.name} {ad.model}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Showing {comments.length} comment{comments.length === 1 ? "" : "s"} for this ad, newest first.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ads"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Back to listings
            </Link>
            <Link
              href={`/ads/${ad.id}`}
              className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              Ad details
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">Ad information</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-900">Name</p>
                <p>{ad.name}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Model</p>
                <p>{ad.model}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Year</p>
                <p>{ad.year}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Posted by</p>
                <p>{ad.ownerName}</p>
              </div>
            </div>
          </div>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-slate-900">{comment.ownerName}</p>
                    <p className="text-xs text-slate-500">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString()
                        : "Unknown date"}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-700">{comment.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
              No comments exist for this ad yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
