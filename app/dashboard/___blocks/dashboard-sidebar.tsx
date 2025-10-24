"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@ui/sidebar";
import { BookText, LayoutGrid, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define our app's navigation structure
const navLinks = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    label: "Overview",
  },
  {
    label: "Content Management",
    subLinks: [
      {
        href: "/dashboard/terms",
        icon: BookText,
        label: "Lexicon Terms",
      },
      {
        href: "/dashboard/term-categories",
        icon: LayoutGrid,
        label: "Term Categories",
      },
      {
        href: "/dashboard/tags",
        icon: Tag,
        label: "Tags",
      },
    ],
  },
  // Add other groups like "Community & Governance" here later
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        {navLinks.map((item, index) => (
          <SidebarGroup key={index}>
            {/* If the item has subLinks, it's a group with a label */}
            {item.subLinks ? (
              <>
                <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.subLinks.map((link) => {
                      // An item is active if the current URL path starts with its href
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
              // Otherwise, it's a single, top-level link
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      // A top-level link is active only on an exact match
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
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
