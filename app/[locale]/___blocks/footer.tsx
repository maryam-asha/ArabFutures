"use client";

import { useTranslations } from "next-intl";

export default function PublicFooter() {
  const t = useTranslations("Public.metadata");

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>
            {`©${new Date().getFullYear()}`}{" "}
            <a href="#" className="font-semibold text-foreground hover:underline">
              {t("title")}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
