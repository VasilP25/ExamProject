"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import {
  createAd,
  createCommentForAd,
  deleteAdForUser,
  deleteCommentForUser,
  restoreDeletedComment,
} from "../services/ads";

export type AdActionState = {
  error?: string;
};

function getRequiredField(formData: FormData, field: string): string {
  const value = formData.get(field)?.toString().trim() ?? "";
  if (!value) {
    throw new Error("Please fill in all required fields.");
  }

  return value;
}

function getOptionalUrl(formData: FormData, field: string): string | undefined {
  const value = formData.get(field)?.toString().trim() ?? "";
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error("Picture must be a valid URL.");
  }
}

export async function createAdAction(
  _previousState: AdActionState,
  formData: FormData,
): Promise<AdActionState> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to create an ad.");
    }

    const name = getRequiredField(formData, "name");
    const model = getRequiredField(formData, "model");
    const year = Number(getRequiredField(formData, "year"));
    const description = getRequiredField(formData, "description");
    const picture = getOptionalUrl(formData, "picture");

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      throw new Error("Year must be between 1900 and 2100.");
    }
    if (description.length > 1200) {
      throw new Error("Description must be 1200 characters or less.");
    }

    await createAd({
      name,
      model,
      year,
      description,
      picture,
      ownerId: user.id,
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to create ad. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteAdAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to delete an ad.");
  }

  const adId = Number(formData.get("adId"));
  if (!Number.isInteger(adId)) {
    throw new Error("Invalid ad.");
  }

  const wasDeleted = await deleteAdForUser(adId, user);
  if (!wasDeleted) {
    throw new Error("You do not have permission to delete this ad.");
  }

  revalidatePath("/dashboard");
}

export async function deleteCommentAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to delete a comment.");
  }

  const commentId = Number(formData.get("commentId"));
  if (!Number.isInteger(commentId)) {
    throw new Error("Invalid comment.");
  }

  const deletedComment = await deleteCommentForUser(commentId, user);
  if (!deletedComment) {
    throw new Error("You do not have permission to delete this comment.");
  }

  revalidatePath(`/ads/${deletedComment.adId}`);
  revalidatePath(`/ads/${deletedComment.adId}/comments`);
  revalidatePath("/ads");
  revalidatePath("/dashboard");
}

export async function createCommentAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to add a comment.");
  }

  const adId = Number(formData.get("adId"));
  if (!Number.isInteger(adId)) {
    throw new Error("Invalid ad.");
  }

  const text = getRequiredField(formData, "text");
  if (text.length > 1000) {
    throw new Error("Comment must be 1000 characters or less.");
  }

  await createCommentForAd({
    adId,
    userId: user.id,
    text,
  });

  revalidatePath(`/ads/${adId}`);
  revalidatePath(`/ads/${adId}/comments`);
  revalidatePath("/ads");
  revalidatePath("/dashboard");
}

export async function restoreDeletedCommentAction(
  formData: FormData,
): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.userType !== "admin") {
    throw new Error("Only admins can restore deleted comments.");
  }

  const bannedCommentId = Number(formData.get("bannedCommentId"));
  if (!Number.isInteger(bannedCommentId)) {
    throw new Error("Invalid deleted comment.");
  }

  const restoredComment = await restoreDeletedComment(bannedCommentId);
  if (!restoredComment) {
    throw new Error("Unable to restore this comment.");
  }

  revalidatePath(`/ads/${restoredComment.adId}`);
  revalidatePath(`/ads/${restoredComment.adId}/comments`);
  revalidatePath("/ads");
  revalidatePath("/dashboard");
  revalidatePath("/admin/deleted-comments");
}
