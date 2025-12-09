import { Link } from "@i18n/navigation";
import { Button } from "@ui/button";
import { ArrowDownLeft, ArrowDownRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function HeroSection() {
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
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/#newsletter">
                {t("ctaSecondary")}
                {locale === "ar" ? <ArrowDownLeft className="size-4" /> : <ArrowDownRight className="size-4" />}
              </Link>
            </Button>
            <Button variant="outline" className="bg-primary hover:bg-primary/60 w-full sm:w-auto" size="lg" asChild>
              <Link target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSeM17A9FAn27cf0euJYTqxGc-ZHxpAQbC8JBfuGjEq9HAS2IA/viewform">
                {t("ctaPrimary")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
