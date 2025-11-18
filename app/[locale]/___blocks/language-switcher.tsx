"use client";

import i18nAppConfig from "@i18n/config";
import { usePathname, useRouter } from "@i18n/navigation";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { LanguagesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Public.nav");
  const handleLocaleChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={isPending}>
          <LanguagesIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("change-language-sr")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
          {i18nAppConfig.locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} className="cursor-pointer text-base">
              {i18nAppConfig.labels[code] || code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
