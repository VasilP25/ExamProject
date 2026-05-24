"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  createToken,
  loginUser,
  registerUser,
  setSessionCookie,
} from "./auth";

export type AuthActionState = {
  error?: string;
};

function getRequiredField(formData: FormData, field: string): string {
  const value = formData.get(field)?.toString().trim() ?? "";
  if (!value) {
    throw new Error("Please fill in all required fields.");
  }

  return value;
}

function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    const email = getRequiredField(formData, "email");
    const password = getRequiredField(formData, "password");
    const user = await loginUser({ email, password });
    const token = createToken(user);

    await setSessionCookie(token);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again.",
    };
  }

  redirect("/");
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    const name = getRequiredField(formData, "name");
    const email = getRequiredField(formData, "email");
    const password = getRequiredField(formData, "password");

    validatePassword(password);

    const user = await registerUser({ name, email, password });
    const token = createToken(user);

    await setSessionCookie(token);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
    };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}
