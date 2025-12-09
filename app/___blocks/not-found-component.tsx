"use client";

import { Button } from "@components/ui/button";
import { Link } from "@i18n/navigation";
import { Frown } from "lucide-react";
import { useTranslations } from "next-intl";

interface NotFoundComponentProps {
  homePath?: string; // To allow different home paths for public vs. dashboard
}

export function NotFoundComponent({ homePath = "/" }: NotFoundComponentProps) {
  const t = useTranslations("NotFound");

  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-20">
      <Frown className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-6xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild>
          <Link href={homePath}>{t("goBackButton")}</Link>
        </Button>
      </div>
    </div>
  );
}
