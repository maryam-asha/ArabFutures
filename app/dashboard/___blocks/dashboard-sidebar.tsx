"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "@ui/sidebar";
import { BookText, CheckSquare, Layers, LayoutGrid, Library, Newspaper, Tag, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "./logout-button";

interface DashboardSidebarProps {
  pendingReviewCount: number;
}

export default function DashboardSidebar({ pendingReviewCount }: DashboardSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Dashboard.sidebar");

  const navLinks = [
    {
      href: "/dashboard",
      icon: LayoutGrid,
      label: t("overview"),
    },
    {
      label: t("contentManagement"),
      subLinks: [
        { href: "/dashboard/terms", icon: BookText, label: t("terms") },
        { href: "/dashboard/term-categories", icon: LayoutGrid, label: t("termCategories") },
        { href: "/dashboard/tags", icon: Tag, label: t("tags") },
        { href: "/dashboard/members", icon: Users, label: t("members") },
        { href: "/dashboard/resources", icon: Library, label: t("resources") },
        { href: "/dashboard/collections", icon: Layers, label: t("collections") },
        { href: "/dashboard/blog", icon: Newspaper, label: t("blog") },
        {
          href: "/dashboard/reviews",
          icon: CheckSquare,
          label: t("reviews"),
          badge: pendingReviewCount > 0 ? pendingReviewCount : null,
        },
        { href: "/dashboard/approvals", icon: CheckSquare, label: t("approvals") },
      ],
    },
  ];

  return (
    <Sidebar side={locale === "ar" ? "right" : "left"}>
      <SidebarContent>
        {navLinks.map((item, index) => (
          <SidebarGroup key={index}>
            {item.subLinks ? (
              <>
                <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.subLinks.map((link) => {
                      const isActive = pathname.startsWith(link.href);
                      return (
                        <SidebarMenuItem key={link.href}>
                          <SidebarMenuButton asChild isActive={isActive} tooltip={link.label}>
                            <Link href={link.href}>
                              <link.icon />
                              <span>{link.label}</span>
                              {link.badge && <SidebarMenuBadge>{link.badge}</SidebarMenuBadge>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                      <Link href={item.href!}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
