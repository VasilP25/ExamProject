"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { AdActionState } from "../lib/ad-actions";

type AdFormProps = {
  action: (
    previousState: AdActionState,
    formData: FormData,
  ) => Promise<AdActionState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full justify-center rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Creating..." : "Create ad"}
    </button>
  );
}

export default function AdForm({ action }: AdFormProps) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <label className="block text-sm font-medium text-slate-700">
        Brand
        <input
          name="name"
          type="text"
          placeholder="Ford"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Model
        <input
          name="model"
          type="text"
          placeholder="Focus"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Year of registration
        <input
          name="year"
          type="number"
          min={1900}
          max={2100}
          placeholder="2018"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Picture URL
        <input
          name="picture"
          type="url"
          placeholder="https://example.com/car.jpg"
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <SubmitButton />
    </form>
  );
}
