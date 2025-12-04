"use client";

import { getCsrfTokenAction, signInAction } from "@app/auth-actions";
import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { CsrfProvider } from "@waelhabbaldev/next-jwt-auth/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";

function SigninForm() {
  const t = useTranslations("Public.signin");
  const tCommon = useTranslations("Common");
  const [state, formAction] = useActionState(signInAction, undefined);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-1">
        <Label htmlFor="username">{t("username")}</Label>
        <Input type="text" id="username" placeholder={t("usernamePlaceholder")} name="username" />
      </div>

      <div className="w-full space-y-1">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input id="password" type={isVisible ? "text" : "password"} placeholder={t("passwordPlaceholder")} className="pr-9" name="password" />
          <Button type="button" variant="ghost" size="icon" onClick={() => setIsVisible((prevState) => !prevState)} className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent">
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">{isVisible ? t("hidePassword") : t("showPassword")}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-y-2">
        <div className="flex items-center gap-3">
          <Checkbox id="rememberMe" />
          <Label htmlFor="rememberMe" className="text-muted-foreground font-normal">
            {t("rememberMe")}
          </Label>
        </div>
        <a href="#" className="hover:underline text-sm">
          {t("forgotPassword")}
        </a>
      </div>

      <SubmitButton isEditMode={false} createText={t("cta")} pendingText={tCommon("saving")} />

      {state?.error && <p className="text-sm text-destructive text-center">{t(state.error as any)}</p>}
    </form>
  );
}

export default function SigninPage() {
  const t = useTranslations("Public.signin");
  const tCommon = useTranslations("Common");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCsrfTokenAction()
      .then((token) => setCsrfToken(token))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !csrfToken) {
    return <div className="w-full max-w-md text-center text-gray-500">{tCommon("loading")}</div>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-2 text-gray-800">{t("title")}</h1>
        <p className="text-center text-gray-500 mb-8">{t("description")}</p>
        <CsrfProvider token={csrfToken}>
          <SigninForm />
        </CsrfProvider>
      </div>
    </main>
  );
}
