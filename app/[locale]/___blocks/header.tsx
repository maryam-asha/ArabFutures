"use client";

import { Link, useRouter } from "@i18n/navigation";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { Home, MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "./language-switcher";

const navLinks = [
  { label: "about", href: "/#about" },
  { label: "work", href: "/#work" },
  { label: "home", href: "/" },
  { label: "projects", href: "/terms" },
  { label: "contact", href: "/contact" },
];

function moveItemToFront(arr: typeof navLinks, prop: keyof (typeof navLinks)[0], value: string) {
  const newArr = [...arr];

  const itemIndex = newArr.findIndex((item) => item[prop] === value);

  if (itemIndex > -1) {
    const [itemToMove] = newArr.splice(itemIndex, 1);

    newArr.unshift(itemToMove);
  }

  return newArr;
}

const Navbar = () => {
  const router = useRouter();
  const tNav = useTranslations("Public.nav");

  return (
    <header className="sticky top-0 bg-background w-full p-2 md:p-4 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <div className="text-muted-foreground font-bold text-lg flex-1 items-center gap-8 hidden md:flex md:justify-center lg:gap-16">
          {navLinks.map((item) =>
            item.label === "home" ? (
              <Link key={`${item.label}`} href={item.href} className="ring-2 rounded-full p-1">
                <Home className="w-5 h-5" />
              </Link>
            ) : (
              <Link className="hover:border-b hover:-mt-1" key={`${item.label}`} href={item.href}>
                {tNav(item.label)}
              </Link>
            ),
          )}
        </div>

        <div className=" flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">{tNav("menu-sr")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="center">
              <DropdownMenuGroup>
                {moveItemToFront(navLinks, "label", "home").map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      router.push(item.href);
                    }}
                    className="cursor-pointer"
                  >
                    {tNav(item.label)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="fixed end-2 top-2 flex flex-1 items-center justify-end gap-6">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
