import i18nAppConfig from "@root/i18n/config";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(`/${i18nAppConfig.defaultLocale}`);
}
