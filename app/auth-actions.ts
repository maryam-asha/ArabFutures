"use server";

import { auth } from "@lib/auth";
import { AppUserIdentity } from "@root/dal/auth-dx";
import { AuthError, AuthSession, InvalidCredentialsError, RateLimitError } from "@waelhabbaldev/next-jwt-auth";
import { redirect } from "next/navigation";

export async function signInAction(prevState: { error: string } | undefined, formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await auth.signIn(username, password);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { error: "Public.signin.errors.invalidCredentials" };
    }
    if (error instanceof RateLimitError) {
      return { error: "Public.signin.errors.rateLimit" };
    }
    if (error instanceof AuthError) {
      return { error: "Public.signin.errors.genericAuthError" };
    }

    console.error("An unexpected sign-in error occurred:", error);
    return { error: "Common.unexpectedError" };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  redirect(callbackUrl);
}

export async function signOutAction() {
  await auth.signOut();
  redirect("/signin");
}

export async function getSessionAction(): Promise<AuthSession<AppUserIdentity>> {
  return auth.getSession();
}

export async function getCsrfTokenAction(): Promise<string> {
  return auth.getCsrfToken();
}
