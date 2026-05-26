import Link from "next/link";
import DashboardAdCard from "../../components/dashboard-ad-card";
import { getAdHighlights, type DashboardAd } from "../../services/ads";

type HighlightCardProps = {
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  ad: DashboardAd | null;
};

function HighlightCard({
  title,
  description,
  metricLabel,
  metricValue,
  ad,
}: HighlightCardProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
          {title}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          {ad ? `${ad.name} ${ad.model}` : "No ads yet"}
        </h2>
        <p className="mt-3 text-sm text-slate-600">{description}</p>
        <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {metricLabel}
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {metricValue}
          </p>
        </div>
      </div>

      {ad ? (
        <DashboardAdCard
          ad={ad}
          canDelete={false}
          canLike={false}
          canViewPrivateDetails
        />
      ) : null}
    </section>
  );
}

export default async function HighlightsPage() {
  const highlights = await getAdHighlights();

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              Car insights
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Top ads
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              See the ad with the most likes, the ad with the most comments, and
              the most expensive car listing.
            </p>
          </div>
          <Link
            href="/ads"
            className="inline-flex justify-center rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
          >
            Browse all ads
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <HighlightCard
          title="Most liked"
          description="The listing with the highest number of likes."
          metricLabel="Likes"
          metricValue={`${highlights.mostLiked?.likes ?? 0}`}
          ad={highlights.mostLiked}
        />
        <HighlightCard
          title="Most commented"
          description="The listing with the most visible comments."
          metricLabel="Comments"
          metricValue={`${highlights.mostCommented?.commentCount ?? 0}`}
          ad={highlights.mostCommented}
        />
        <HighlightCard
          title="Most expensive"
          description="The listing with the highest asking price."
          metricLabel="Price"
          metricValue={
            highlights.mostExpensive
              ? `${highlights.mostExpensive.price.toLocaleString("en-US")} EUR`
              : "0 EUR"
          }
          ad={highlights.mostExpensive}
        />
      </div>
    </section>
  );
}
