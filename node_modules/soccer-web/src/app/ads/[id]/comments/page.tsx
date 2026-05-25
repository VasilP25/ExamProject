import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdDetail, getCommentsForAd } from "../../../../services/ads";

type AdCommentsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdCommentsPage({
  params,
}: AdCommentsPageProps) {
  const { id } = await params;
  const adId = Number(id);
  if (!Number.isInteger(adId)) {
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
              {ad.name} {ad.model}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Posted by {ad.ownerName}. Showing {comments.length} comment
              {comments.length === 1 ? "" : "s"}.
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
              href="/dashboard"
              className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <div className="aspect-[4/3] bg-slate-100">
              {ad.picture ? (
                <Image
                  src={ad.picture}
                  alt={`${ad.name} ${ad.model}`}
                  width={800}
                  height={600}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm font-medium text-slate-500">
                  No picture
                </div>
              )}
            </div>
            <div className="space-y-3 p-6 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-950">Brand:</span>{" "}
                {ad.name}
              </p>
              <p>
                <span className="font-semibold text-slate-950">Model:</span>{" "}
                {ad.model}
              </p>
              <p>
                <span className="font-semibold text-slate-950">Year:</span>{" "}
                {ad.year}
              </p>
              <p>
                <span className="font-semibold text-slate-950">Posted by:</span>{" "}
                {ad.ownerName}
              </p>
            </div>
          </article>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-950">Comments</h2>
            {comments.length > 0 ? (
              <div className="mt-5 space-y-4">
                {comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        {comment.ownerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : "Unknown date"}
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-700">
                      {comment.text}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600">
                No comments exist for this ad yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
