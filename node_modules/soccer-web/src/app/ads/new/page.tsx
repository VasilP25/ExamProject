import AdForm from "../../../components/ad-form";
import { requireAuth } from "../../../lib/auth";
import { createAdAction } from "../../../lib/ad-actions";

export default async function NewAdPage() {
  await requireAuth();

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
          New ad
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">
          Create car ad
        </h1>
      </div>

      <AdForm action={createAdAction} />
    </section>
  );
}
