import Link from "next/link";
import { redirect } from "next/navigation";
import { restoreDeletedCommentAction } from "../../../lib/ad-actions";
import { getCurrentUser } from "../../../lib/auth";
import { getDeletedComments } from "../../../services/ads";

export default async function DeletedCommentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.userType !== "admin") {
    redirect("/dashboard");
  }

  const deletedComments = await getDeletedComments();

  return (
    <section className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-700">
              Admin
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Deleted comments
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Review archived comments and restore them to their ads.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {deletedComments.length > 0 ? (
        <div className="space-y-4">
          {deletedComments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {comment.adName} {comment.adModel}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Deleted by {comment.bannedByName}
                      {comment.bannedAt
                        ? ` on ${new Date(comment.bannedAt).toLocaleString()}`
                        : ""}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Original author: {comment.commentOwnerName ?? "Unknown"}
                  </p>
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {comment.commentText || "No archived comment text."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/ads/${comment.adId}/comments`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    View ad
                  </Link>
                  {comment.commentText && comment.commentOwnerId ? (
                    <form action={restoreDeletedCommentAction}>
                      <input
                        type="hidden"
                        name="bannedCommentId"
                        value={comment.id}
                      />
                      <button
                        type="submit"
                        className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800"
                      >
                        Restore
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-600">
          There are no deleted comments.
        </div>
      )}
    </section>
  );
}
