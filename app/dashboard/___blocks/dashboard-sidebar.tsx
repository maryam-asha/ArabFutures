"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@ui/sidebar";
import { BookText, CheckSquare, LayoutGrid, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar() {
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
    </Sidebar>
  );
}
