"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const PlaceholderNexus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7.5 12c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5 5.5-2.462 5.5-5.5" />
    <path d="M16.5 12c3.038 0 5.5-2.462 5.5-5.5S19.538 1 16.5 1 11 3.462 11 6.5" />
    <path d="M11 17.5c0-3.038-2.462-5.5-5.5-5.5" />
    <path d="M13 6.5c0 3.038 2.462 5.5 5.5 5.5" />
    <path d="M7.5 12c-3.038 0-5.5-2.462-5.5-5.5S4.462 1 7.5 1 13 3.462 13 6.5" />
  </svg>
);
const PlaceholderSphere = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
  </svg>
);
const PlaceholderLattice = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);
const PlaceholderPath = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M17 3h6v6" />
  </svg>
);

type ImageLogo = { type: "image"; src: string; alt: string };
type SvgLogo = { type: "svg"; Component: React.FC<{ className?: string }>; alt: string };
type Logo = ImageLogo | SvgLogo;

export default function FriendsSection() {
  const t = useTranslations("Public.friends");

  const logos: Logo[] = [
    { type: "image", src: "/logo-dark.png", alt: t("yourLogoAlt") },
    { type: "svg", Component: PlaceholderNexus, alt: t("partnerLogoAlt", { number: 1 }) },
    { type: "svg", Component: PlaceholderSphere, alt: t("partnerLogoAlt", { number: 2 }) },
    { type: "svg", Component: PlaceholderLattice, alt: t("partnerLogoAlt", { number: 3 }) },
    { type: "svg", Component: PlaceholderPath, alt: t("partnerLogoAlt", { number: 4 }) },
  ];

  return (
    <section id="freinds-section" className="scroll-mt-36">
      <div className="bg-muted/20 mx-auto mb-8 md:mb-16 lg:mb-24">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">{t("title")}</h2>

          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12">
            {logos.map((logo, index) => (
              <div key={index} className="shrink-0">
                {logo.type === "image" ? <Image src={logo.src} alt={logo.alt} width={150} height={48} className="max-h-12 w-auto" /> : <logo.Component className="h-12 w-auto text-muted-foreground/60" aria-label={logo.alt} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
