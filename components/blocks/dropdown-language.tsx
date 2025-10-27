"use client";

import i18nAppConfig from "@i18n/config";
import { usePathname, useRouter } from "@i18n/navigation";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { LanguagesIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { type ReactNode, useTransition } from "react";

type Props = {
  trigger?: ReactNode;
  align?: "start" | "center" | "end";
};

const LanguageDropdown = ({ align, trigger }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" disabled={isPending}>
            <LanguagesIcon />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align={align || "end"}>
        <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
          {Object.entries(i18nAppConfig.locales).map(([code, name]) => (
            <DropdownMenuRadioItem key={code} value={code} className="cursor-pointer text-base">
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
