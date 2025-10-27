"use client";

import { Link, usePathname } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";

export default function PublicHeader() {
  const t = useTranslations("Public.nav");
  const pathname = usePathname();
  const navLinks = ["about", "work", "projects", "blogs", "contact"];

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-center">
        <nav className="flex">
          <ul className="flex items-center gap-8 text-base font-medium">
            {navLinks.map((key) => (
              <li key={key}>
                <Link href={key === "about" ? "/#about" : `/${key}`} className={cn("group relative text-muted-foreground transition-colors hover:text-foreground", (pathname === `/${key}` || (pathname === "/" && key === "about")) && "text-foreground")}>
                  <span
                    className={cn(
                      "absolute -start-4 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity",
                      "group-hover:opacity-100",
                      (pathname === `/${key}` || (pathname === "/" && key === "about")) && "opacity-100",
                    )}
                  ></span>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
