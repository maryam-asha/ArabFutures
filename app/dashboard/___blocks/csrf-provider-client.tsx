"use client";

import { getCsrfTokenAction } from "@app/auth-actions";
import { CsrfProvider } from "@waelhabbaldev/next-jwt-auth/client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CsrfContextType {
  csrfToken: string;
  setCsrfToken: React.Dispatch<React.SetStateAction<string>>;
}

const CsrfContext = createContext<CsrfContextType | null>(null);

export const useReactiveCsrf = () => {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error("useReactiveCsrf must be used within a CsrfManager");
  }
  return context;
};

export default function CsrfManager({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    getCsrfTokenAction().then((token) => {
      setCsrfToken(token);
    });
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken, setCsrfToken }}>
      <CsrfProvider token={csrfToken}>{children}</CsrfProvider>
    </CsrfContext.Provider>
  );
}
