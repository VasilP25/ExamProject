import Link from "next/link";
import { getCurrentUser } from "../lib/auth";
import { logoutAction } from "../lib/auth-actions";
import SiteNavigation from "./site-navigation";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold text-slate-950">
          Cars App
        </Link>
        <SiteNavigation user={user} logoutAction={logoutAction} />
      </div>
    </header>
  );
}
