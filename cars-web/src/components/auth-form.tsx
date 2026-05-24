"use client";

import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLabel = mode === "login" ? "Sign in" : "Create account";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.alert(
      `${mode === "login" ? "Login" : "Register"} attempt for ${email}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
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

      {mode === "register" && (
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Your full name"
            required
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
          />
        </label>
      )}

      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="you@example.com"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="••••••••"
          required
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none ring-slate-400 transition focus:border-slate-900 focus:ring-2"
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full justify-center rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
