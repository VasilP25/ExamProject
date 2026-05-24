import Image from "next/image";
import { deleteAdAction } from "../lib/ad-actions";
import type { DashboardAd } from "../services/ads";

type DashboardAdCardProps = {
  ad: DashboardAd;
  canDelete: boolean;
};

export default function DashboardAdCard({
  ad,
  canDelete,
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
        <p className="text-sm font-medium text-slate-600">
          Posted by: {ad.ownerName}
        </p>
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
