"use client";

import Link from "next/link";
import { useState } from "react";

type User = {
  name: string;
  email: string;
  userType: string;
};

type Props = {
  user: User | null;
  logoutAction: (formData: FormData) => Promise<void>;
};

export default function SiteNavigation({ user, logoutAction }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href="/"
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Home
        </Link>
        <Link
          href="/ads"
          className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Browse ads
        </Link>
        {user ? (
          <>
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link
              href="/liked-cars"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Liked cars
            </Link>
            <Link
              href="/ads/new"
              className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              New ad
            </Link>
            {user.userType === "admin" ? (
              <Link
                href="/admin/deleted-comments"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Deleted comments
              </Link>
            ) : null}
            <form action={logoutAction} method="post" className="inline">
              <button
                type="submit"
                className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Register
            </Link>
          </>
        )}
        {user ? (
          <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 sm:inline-flex">
            {user.name} | {user.email}
            {user.userType === "admin" ? " | Admin" : ""}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-between gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:hidden"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        Menu
        <span className="text-base">{menuOpen ? "▲" : "☰"}</span>
      </button>

      {menuOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:hidden">
          <div className="flex flex-col gap-3">
            {user ? (
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">{user.name}</p>
                <p className="truncate text-slate-500">{user.email}</p>
                {user.userType === "admin" ? <p className="text-slate-500">Admin</p> : null}
              </div>
            ) : null}
            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              href="/ads"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Browse ads
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/liked-cars"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Liked cars
                </Link>
                <Link
                  href="/ads/new"
                  className="rounded-2xl bg-sky-700 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-800"
                >
                  New ad
                </Link>
                {user.userType === "admin" ? (
                  <Link
                    href="/admin/deleted-comments"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Deleted comments
                  </Link>
                ) : null}
                <form action={logoutAction} method="post">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-orange-600"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-2xl bg-sky-700 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
