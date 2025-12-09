"use client";

import { signOutAction } from "@app/auth-actions";
import { SidebarMenuButton } from "@components/ui/sidebar";
import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export function LogoutButton() {
  const t = useTranslations("Dashboard.sidebar");
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      signOutAction();
    });
  };

  return (
    <form action={handleSignOut} className="w-full">
      <SidebarMenuButton type="submit" disabled={isPending} className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" tooltip={t("logout")}>
        <LogOutIcon className="size-4" />
        <span>{t("logout")}</span>
      </SidebarMenuButton>
    </form>
  );
}
