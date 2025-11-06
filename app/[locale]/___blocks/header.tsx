import { Link } from "@i18n/navigation";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const navLinks = [
  { label: "vision", href: "/#vision", color: "hsl(195, 80%, 60%)" },
  { label: "work", href: "/#work", color: "hsl(45, 90%, 60%)" },
  { label: "about", href: "/#about", color: "hsl(260, 90%, 70%)" },
  { label: "home", href: "/", color: "hsl(var(--primary))" },
  { label: "blogs", href: "", color: "hsl(340, 90%, 70%)" },
  { label: "projects", href: "/terms", color: "hsl(340, 90%, 70%)" },
  { label: "contact", href: "/contact", color: "hsl(145, 70%, 55%)" },
];

const HomeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14V9.5" />
    <path d="M12 14V9.5" />
    <path d="M16 14V9.5" />
    <path d="M7 14h10" />
  </svg>
);

const Navbar = () => {
  const tNav = useTranslations("Public.nav");

  return (
    <header className="sticky top-0 bg-background w-full p-2 md:p-4 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <div className="text-muted-foreground  flex-1 items-center gap-8 font-medium hidden md:flex md:justify-center lg:gap-16">
          {navLinks.map((item) =>
            item.label === "home" ? (
              <Link key={`${item.label}`} href={item.href}>
                <HomeIcon className="w-12 h-12" />
              </Link>
            ) : (
              <Link key={`${item.label}`} href={item.href}>
                {tNav(item.label)}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navLinks
                  .filter((item) => item.label !== "home")
                  .map((item, index) => (
                    <DropdownMenuItem key={index}>
                      <Link href={item.href}>{tNav(item.label)}</Link>
                      {/* <a href={item.href}>{item.title}</a> */}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
