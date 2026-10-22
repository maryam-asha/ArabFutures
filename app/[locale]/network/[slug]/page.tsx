import { AppLocale } from "@i18n/config";
import type { MemberContentDb } from "@root/dal/dal.types";
import { findMemberBySlug } from "@root/dal/members-dx";
import { Globe, Linkedin, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { MemberWorks } from "../___blocks/member-works";

type LocaleRecord = Partial<Record<AppLocale, string>> | undefined;

/** Picks the current-locale text, falling back to the other locale then empty string. */
function pick(field: LocaleRecord, locale: AppLocale): string {
  if (!field) return "";
  return field[locale] || field[locale === "ar" ? "en" : "ar"] || "";
}

function initials(name: string) {
  return name
    .replace(/^(Dr\.|د\.)\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

/** A labelled profile section (Role within AFS, Professional Profile, …). */
function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="afs-label text-gold text-sm">{title}</h2>
      <div className="text-light/85 mt-3 leading-relaxed whitespace-pre-line">{children}</div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = await findMemberBySlug(slug);
  if (!member) return {};
  const locale = (await getLocale()) as AppLocale;
  const name = pick(member.content.name, locale);
  const role = pick(member.content.role, locale);
  return { title: name, description: role };
}

export default async function MemberDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await findMemberBySlug(slug);
  if (!member) notFound();

  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.member");
  const c: MemberContentDb = member.content;

  const name = pick(c.name, locale);
  const role = pick(c.role, locale);
  const roleWithinAsf = pick(c.roleWithinAsf, locale);
  const professionalProfile = pick(c.professionalProfile, locale);
  const favoriteWord = pick(c.favoriteWord?.word, locale);
  const favoriteWordWhy = pick(c.favoriteWord?.explanation, locale);
  const social = c.social ?? {};
  const links = c.links ?? [];

  return (
    <div className="afs-container py-14 lg:py-20">
      <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-14">
        {/* Portrait + social */}
        <div>
          <div className="relative aspect-square w-full max-w-[20rem] overflow-hidden border border-light/15 bg-[linear-gradient(160deg,#2f2f2f_0%,#1a1a1a_70%)]">
            {c.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- member photos are arbitrary external URLs, not bundled assets.
              <img src={c.photoUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span aria-hidden className="afs-display text-light/10 absolute inset-0 flex items-center justify-center text-[7rem] leading-none">
                {initials(name)}
              </span>
            )}
          </div>
          {(social.email || social.linkedin || social.website) && (
            <div className="mt-5 flex items-center gap-3">
              {social.email && (
                <a href={`mailto:${social.email}`} aria-label={t("email")} className="text-light/70 hover:border-gold hover:text-gold flex size-10 items-center justify-center border border-light/40 transition-colors">
                  <Mail className="size-4" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={t("linkedin")} className="text-light/70 hover:border-gold hover:text-gold flex size-10 items-center justify-center border border-light/40 transition-colors">
                  <Linkedin className="size-4" />
                </a>
              )}
              {social.website && (
                <a href={social.website} target="_blank" rel="noopener noreferrer" aria-label={t("website")} className="text-light/70 hover:border-gold hover:text-gold flex size-10 items-center justify-center border border-light/40 transition-colors">
                  <Globe className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="afs-display text-gold text-[clamp(2.4rem,5vw,3.5rem)] leading-none uppercase">{name}</h1>
          {role && <p className="text-light/90 mt-3 text-xl">{role}</p>}

          {roleWithinAsf && <ProfileSection title={t("roleWithinAsf")}>{roleWithinAsf}</ProfileSection>}
          {professionalProfile && <ProfileSection title={t("professionalProfile")}>{professionalProfile}</ProfileSection>}
          {(favoriteWord || favoriteWordWhy) && (
            <ProfileSection title={t("favoriteWord")}>
              {favoriteWord && <p className="text-light font-medium">{favoriteWord}</p>}
              {favoriteWordWhy && <p className="mt-1">{favoriteWordWhy}</p>}
            </ProfileSection>
          )}
        </div>
      </div>

      <MemberWorks works={c.works ?? []} locale={locale} title={t("selectedWorks")} intro={t("selectedWorksIntro")} blogLabel={t("blogLabel")} />

      {links.length > 0 && (
        <section className="mt-20">
          <h2 className="afs-display text-light text-[clamp(1.8rem,3vw,2.6rem)]">{t("additionalLinks")}</h2>
          <p className="text-light/80 mt-2 max-w-[48rem]">{t("additionalLinksIntro")}</p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link, index) => {
              const label = pick(link.label, locale) || t("link");
              const inner = (
                <span className="border-light/20 hover:border-gold flex min-h-[7rem] flex-col items-center justify-center gap-3 border p-6 text-center transition-colors">
                  <span className="afs-label text-light text-base">{label}</span>
                </span>
              );
              return (
                <li key={index}>
                  {link.url ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
