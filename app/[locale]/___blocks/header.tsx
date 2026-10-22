"use client";

import { Link } from "@i18n/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@ui/sheet";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "./language-switcher";

const primaryLinks = [
  { label: "brand", href: "/" },
  { label: "ourProjects", href: "/#projects" },
  { label: "library", href: "/library" },
  { label: "network", href: "/#network" },
  { label: "aboutUs", href: "/about" },
] as const;

const linkClass = "afs-label text-light hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold";

const Navbar = () => {
  const tNav = useTranslations("Public.nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ink relative z-50 w-full">
      <div className="afs-container flex h-22 items-center justify-between gap-8">
        <nav aria-label={tNav("menu-sr")} className="hidden items-center gap-11 md:flex">
          {primaryLinks.map((item) => (
            <Link key={item.label} href={item.href} className={linkClass}>
              {tNav(item.label)}
            </Link>
          ))}
        </nav>
        <Link href="/" className={`${linkClass} md:hidden`}>
          {tNav("brand")}
        </Link>

        <div className="flex items-center gap-6 md:gap-7">
          <Link href="/contact" className={`${linkClass} hidden md:inline`}>
            {tNav("contactUs")}
          </Link>
          <Link href="/contact" className="afs-label border-gold text-gold hover:bg-gold hover:text-ink hidden border px-4 py-2 transition-colors sm:inline-block">
            {tNav("partner")}
          </Link>
          <LanguageSwitcher />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="text-light hover:text-gold p-1 md:hidden">
              <MenuIcon className="size-6" />
              <span className="sr-only">{tNav("menu-sr")}</span>
            </SheetTrigger>
            <SheetContent side="top" className="bg-ink border-border border-b">
              <SheetTitle className="sr-only">{tNav("menu-sr")}</SheetTitle>
              <nav className="afs-container flex flex-col gap-6 py-10">
                {[...primaryLinks, { label: "contactUs", href: "/contact" } as const].map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className={`${linkClass} text-lg`}>
                    {tNav(item.label)}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setOpen(false)} className="afs-label border-gold text-gold self-start border px-4 py-2">
                  {tNav("partner")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
