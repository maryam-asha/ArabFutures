"use client";

import { snakeToCamel } from "@lib/snake-camel-case";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const processedToastKey = useRef<string | null>(null);

  useEffect(() => {
    const toastMessageKey = searchParams.get("toast");
    const entityKey = searchParams.get("entity");

    if (toastMessageKey && entityKey && toastMessageKey !== processedToastKey.current) {
      processedToastKey.current = toastMessageKey;

      const fullMessageKey = `Common.${toastMessageKey}`;
      const entityNameKey = `Dashboard.sidebar.${snakeToCamel(entityKey)}`;

      const entityName = t(entityNameKey as any);
      const message = t(fullMessageKey as any, { entityName });

      toast.success(message);

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("toast");
      newParams.delete("entity");

      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [searchParams, router, pathname, t]);

  return null;
}
