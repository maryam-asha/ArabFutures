"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@components/ui/breadcrumb";
import { usePathname } from "@i18n/navigation";
import { snakeToCamel } from "@lib/snake-camel-case";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

// A simple utility to capitalize strings
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations();

  const breadcrumbItems = React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length > 0 && (segments[0] === "en" || segments[0] === "ar")) {
      segments.shift();
    }

    // Start with the root dashboard link
    const items: { label: string; href: string }[] = [
      {
        label: t("Dashboard.sidebar.overview"),
        href: "/dashboard",
      },
    ];

    if (segments.length > 1) {
      segments.slice(1).forEach((segment, index) => {
        const href = `/${segments.slice(0, index + 2).join("/")}`;
        const isLast = index === segments.length - 2;
        let label = "";

        // --- START OF FIX ---

        // Check for special cases first (edit and create pages)
        if (isLast && /^\d+$/.test(segment)) {
          label = t("Common.actions.edit");
        } else if (segment === "create") {
          label = t("Common.actions.add");
        } else {
          // For all other segments, try to find a valid translation.
          const translationKey = `Dashboard.sidebar.${snakeToCamel(segment)}`;

          const translated = t.has(translationKey) ? t.raw(translationKey) : null;

          // Only use the translation if it's valid and not the key itself.
          if (typeof translated === "string" && translated !== translationKey) {
            label = translated;
          }
          // If no valid translation is found, `label` remains an empty string.
        }

        // Only add the item to the breadcrumb trail if we successfully found a label for it.
        if (label) {
          items.push({ label, href });
        }
      });
    }

    return items;
  }, [pathname, t]);

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="rtl:rotate-180" />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
