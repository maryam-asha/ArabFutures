"use client";

// Needs to be a client component for the onClick handler
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { ServerCrash } from "lucide-react";
import { useTranslations } from "next-intl";

interface FailedToLoadProps {
  /**
   * A function to be called when the user clicks the "Try Again" button.
   * In an error.tsx file, this would be the `reset` function.
   */

  /**
   * Optional custom title for the error message.
   */
  title?: string;
  /**
   * Optional custom description for the error message.
   */
  description?: string;
  /**
   * Optional text for the retry button.
   */
  retryText?: string;
}

/**
 * A standardized, user-friendly component to display when data fetching fails.
 * Designed to be used in error boundaries (`error.tsx`) or as a fallback UI.
 */
export function FailedToLoad({ title, description, retryText }: FailedToLoadProps) {
  const t = useTranslations("Common");

  return (
    <div className="container mx-auto flex items-center justify-center py-16">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ServerCrash className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">{title || t("loadErrorTitile")}</CardTitle>
          <CardDescription>{description || t("loadErrorDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>{retryText || t("reload")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
