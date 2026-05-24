"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { AuthActionState } from "../lib/auth-actions";

type AuthFormProps = {
  mode: "login" | "register";
  action: (
    previousState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full justify-center rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Please wait..." : label}
    </button>
  );
}

export default function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});
  const submitLabel = mode === "login" ? "Sign in" : "Create account";

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">
          {mode === "login" ? "Login to your account" : "Create a new account"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {mode === "login"
            ? "Enter your email and password to sign in."
            : "Fill in the details below to register a new account."}
        </p>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      {mode === "register" ? (
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
          />
        </label>
      ) : null}

      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          name="password"
          type="password"
          autoComplete={
            mode === "login" ? "current-password" : "new-password"
          }
          placeholder="Password"
          minLength={6}
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
