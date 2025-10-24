"use client";

import { getCsrfTokenAction } from "@app/auth-actions";
import { CsrfProvider } from "@waelhabbaldev/next-jwt-auth/client";
import { useEffect, useState } from "react";

export default function CsrfProviderClient({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  useEffect(() => {
    // This code runs ONLY ONCE.
    getCsrfTokenAction().then((token) => {
      setCsrfToken(token); // This causes one re-render, but the effect doesn't run again.
    });
  }, []);
  return <CsrfProvider token={csrfToken || ""}>{children}</CsrfProvider>;
}
