"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialName: string;
  initialModel: string;
  initialYear: string;
};

function buildQuery(name: string, model: string, year: string, page = 1) {
  const params = new URLSearchParams();

  if (name.trim()) {
    params.set("name", name.trim());
  }
  if (model.trim()) {
    params.set("model", model.trim());
  }
  if (year.trim()) {
    params.set("year", year.trim());
  }
  params.set("page", String(page));

  return `/ads?${params.toString()}`;
}

export default function AdsFilterControls({
  initialName,
  initialModel,
  initialYear,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [model, setModel] = useState(initialModel);
  const [year, setYear] = useState(initialYear);
  const [isPending, startTransition] = useTransition();
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.replace(buildQuery(name, model, year, 1));
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [name, model, year, router]);

  return (
    <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            type="search"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Toyota"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Model</span>
          <input
            type="search"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder="Corolla"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Year</span>
          <input
            type="search"
            inputMode="numeric"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="2020"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-end">
        {isPending ? (
          <p className="font-medium text-sky-700">Updating...</p>
        ) : null}
      </div>
    </div>
  );
}
