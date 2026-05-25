import Image from "next/image";
import Link from "next/link";
import { deleteAdAction, toggleAdLikeAction } from "../lib/ad-actions";
import type { DashboardAd } from "../services/ads";

type DashboardAdCardProps = {
  ad: DashboardAd;
  canDelete: boolean;
  canLike?: boolean;
  canViewPrivateDetails?: boolean;
};

export default function DashboardAdCard({
  ad,
  canDelete,
  canLike = true,
  canViewPrivateDetails = true,
}: DashboardAdCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-slate-100">
        {ad.picture ? (
          <Image
            src={ad.picture}
            alt={`${ad.name} ${ad.model}`}
            width={640}
            height={480}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm font-medium text-slate-500">
            No picture
          </div>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {ad.name} {ad.model}
        </h2>
        <p className="text-sm font-medium text-slate-600">
          Year of registration: {ad.year}
        </p>
        {canViewPrivateDetails ? (
          <p className="text-sm font-semibold text-slate-900">
            Price: {ad.price.toLocaleString("en-US")} EUR
          </p>
        ) : null}
        <p className="text-sm font-medium text-slate-600">
          Posted by: {ad.ownerName}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-sm font-semibold text-slate-700">
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
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {ad.isLikedByCurrentUser ? "Liked" : "Like"}
              </button>
            </form>
          ) : null}
        </div>
        {canViewPrivateDetails ? (
          <>
            <p className="text-sm font-medium text-slate-600">
              <Link
                href={`/ads/${ad.id}/comments`}
                className="text-sky-700 hover:underline"
                aria-label={`View ${ad.commentCount} ${ad.commentCount === 1 ? "comment" : "comments"} for ${ad.name} ${ad.model}`}
              >
                View {ad.commentCount}{" "}
                {ad.commentCount === 1 ? "comment" : "comments"}
              </Link>
            </p>
            <Link
              href={`/ads/${ad.id}/download`}
              className="inline-flex w-full justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Download ad
            </Link>
          </>
        ) : null}
        {canDelete ? (
          <form action={deleteAdAction} className="pt-3">
            <input type="hidden" name="adId" value={ad.id} />
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}
