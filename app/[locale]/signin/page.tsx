"use client";

import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { CsrfProvider } from "@waelhabbaldev/next-jwt-auth/client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { getCsrfTokenAction, signInAction } from "../../auth-actions";

function SigninForm() {
  const [state, formAction] = useActionState(signInAction, undefined);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <form className="space-y-4" action={formAction}>
      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="userEmail" className="leading-5">
          User Name*
        </Label>
        <Input type="text" id="username" placeholder="eg. admin" name="username" />
      </div>

      {/* Password */}
      <div className="w-full space-y-1">
        <Label htmlFor="password" className="leading-5">
          Password*
        </Label>
        <div className="relative">
          <Input id="password" type={isVisible ? "text" : "password"} placeholder="••••••••••••••••" className="pr-9" name="password" />
          <Button variant="ghost" size="icon" onClick={() => setIsVisible((prevState) => !prevState)} className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent">
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">{isVisible ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between gap-y-2">
        <div className="flex items-center gap-3">
          <Checkbox id="rememberMe" className="size-6" />
          <Label htmlFor="rememberMe" className="text-muted-foreground">
            {" "}
            Remember Me
          </Label>
        </div>

        <a href="#" className="hover:underline">
          Forgot Password?
        </a>
      </div>

      <Button className="w-full" type="submit">
        Sign in to Shadcn Studio
      </Button>
    </form>
  );
}

export default function SigninPage() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs once on the client after the page loads.
  useEffect(() => {
    // Call the Server Action to get the CSRF token.
    getCsrfTokenAction()
      .then((token) => {
        setCsrfToken(token);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // The empty dependency array ensures this runs only once.

  // While fetching the token, you can show a loading state.
  if (isLoading || !csrfToken) {
    return <div className="w-full max-w-md text-center text-gray-500">Loading form...</div>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-2 text-gray-800">Terms</h1>
        <p className="text-center text-gray-500 mb-8"> Signin</p>
        <CsrfProvider token={csrfToken}>
          <SigninForm />
        </CsrfProvider>
      </div>
    </main>
  );
}
