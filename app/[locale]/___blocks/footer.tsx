"use client";

import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense } from "react";

import { NewsletterForm } from "./newsletter-form";

export default function PublicFooter() {
  const t = useTranslations("Public");

  const columns = [
    { title: t("footer.projects"), links: [{ label: t("footer.lexicon"), href: "/terms" }] },
    {
      title: t("footer.afs"),
      links: [
        { label: t("footer.about"), href: "/about" },
        { label: t("footer.contact"), href: "/contact" },
        { label: t("footer.newsletter"), href: "#newsletter" },
      ],
    },
  ];

  return (
    <footer>
      {/* Newsletter bar (all pages, as in the design). */}
      <section id="newsletter" aria-labelledby="newsletter-title" className="border-light/15 bg-ink scroll-mt-8 border-t">
        <div className="afs-container flex flex-col gap-6 py-12 lg:flex-row lg:items-start lg:justify-between lg:py-14">
          <h2 id="newsletter-title" className="text-light text-xl font-semibold">
            {t("home.newsletterBar")}
          </h2>
          <Suspense fallback={<div className="border-light/40 h-14 w-full max-w-[43rem] border" />}>
            <NewsletterForm />
          </Suspense>
        </div>
      </section>

      <div className="bg-gold text-ink">
        <div className="afs-container py-14">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))]">
            <div className="max-w-sm">
              <Image src="/logo-dark.png" alt={t("metadata.siteName")} width={120} height={98} className="h-auto w-[7.5rem]" />
              <p className="text-ink/85 mt-5 text-[0.95rem] leading-relaxed">{t("metadata.description")}</p>
            </div>
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="font-semibold">{column.title}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-ink/80 hover:text-ink text-[0.95rem] underline-offset-4 hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-ink/40 mt-14 border-t pt-8 text-sm">
            © {new Date().getFullYear()} {t("metadata.siteName")}. {t("footer.rights")}
          </div>
        </div>
      </div>
    </footer>
  );
}
