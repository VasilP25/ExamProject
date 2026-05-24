"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";
import { createAd, deleteAdForUser } from "../services/ads";

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
    const picture = getOptionalUrl(formData, "picture");

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      throw new Error("Year must be between 1900 and 2100.");
    }

    await createAd({
      name,
      model,
      year,
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
