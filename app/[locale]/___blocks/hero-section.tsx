import { Link } from "@i18n/navigation";
import { TermCategoryOption } from "@root/dal/dal.types";
import { Button } from "@ui/button";
import { ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

import { SuggestTermDialog } from "./suggest-term-dialog";

interface HeroSectionProps {
  categories: TermCategoryOption[];
}

export default async function HeroSection({ categories }: HeroSectionProps) {
  const t = await getTranslations("Public.hero");
  const locale = await getLocale();

  return (
    <section id="hero">
      <div className="container flex flex-col items-center justify-center h-dvh mx-auto">
        <div className="flex items-center justify-center pt-8">
          <Image src="/logo-dark.png" alt="Arab Futures Society Logo" className="w-full max-w-md lg:max-w-full rounded-md object-cover" width={512} height={512} priority />
        </div>
        <p className="text-muted-foreground text-center mb-12 max-w-xl lg:text-xl">{t("slogan")}</p>
        <div className="mx-auto flex flex-col items-center text-center lg:items-start lg:text-start">
          <div className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <SuggestTermDialog categories={categories}>
              <Button className="w-full sm:w-auto" size="lg">
                {t("ctaPrimary")}
              </Button>
            </SuggestTermDialog>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/#featured-terms">
                {t("ctaSecondary")}
                {locale === "ar" ? <ArrowDownLeft className="size-4" /> : <ArrowDownRight className="size-4" />}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
