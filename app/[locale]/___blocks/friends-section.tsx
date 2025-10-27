"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function FriendsSection() {
  const t = useTranslations("Public.friends");

  const logos = Array(10).fill("/logo-placeholder.svg");

  return (
    <section className="py-16">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">{t("title")}</h2>
        <div className="w-full inline-flex flex-nowrap overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-256px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
            {logos.map((logo, index) => (
              <li key={index}>
                <Image src={logo} alt={t("logoAlt", { number: index + 1 })} width={158} height={48} className="max-h-12 w-auto" />
              </li>
            ))}
          </ul>
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll" aria-hidden="true">
            {logos.map((logo, index) => (
              <li key={index}>
                <Image src={logo} alt={t("logoAlt", { number: index + 1 })} width={158} height={48} className="max-h-12 w-auto" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
