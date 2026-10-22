import type { AppLocale } from "@i18n/config";
import { findActiveMembers } from "@root/dal/members-dx";
import { getLocale, getTranslations } from "next-intl/server";

import { Cta } from "../afs-cta";
import { NETWORK_MEMBERS, toNetworkMember } from "./data/members";
import { MemberCard } from "./member-card";

/**
 * Growing Network. On desktop (motion allowed) HomeMotion pins this section and scrolls the card
 * track horizontally; elsewhere the track is a native, touch-friendly scroll-snap row.
 *
 * `relative z-[35]` lifts the section (including the real View All link) above the z-30 square
 * overlay, so the square can grow into the diamond *behind* the link without covering it.
 */
export default async function NetworkSection() {
  const t = await getTranslations("Public.home.network");
  const locale = (await getLocale()) as AppLocale;

  // Real members when any exist; otherwise the placeholder set keeps the section designed.
  const dbMembers = await findActiveMembers().catch(() => []);
  const members = dbMembers.length > 0 ? dbMembers.map(toNetworkMember) : NETWORK_MEMBERS;

  return (
    <section id="network" data-section="network" aria-labelledby="network-title" className="relative z-[35] overflow-hidden py-20 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-24">
      <div className="afs-container flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
        <div data-network-head className="max-w-[54rem] min-w-0">
          <h2 id="network-title" className="afs-display text-light text-[clamp(2.4rem,4.2vw,3.6rem)]">
            {t("title")}
            <span aria-hidden data-square-anchor="network-rest" data-rot="0" data-color="#cea864" className="bg-gold ms-[0.18em] inline-block size-[0.15em] align-baseline" />
          </h2>
          <p className="text-light/90 mt-4 text-lg leading-relaxed md:text-xl">{t("description")}</p>
        </div>

        {/* View All. The invisible 256px box is where the square becomes the diamond. */}
        {/* Sized by viewport height too, so the diamond's points stay on screen on short (tablet) viewports. */}
        <div className="relative flex shrink-0 items-center lg:-mt-6 lg:size-[min(16rem,26svh)] lg:justify-center">
          <span aria-hidden data-square-anchor="network-viewall" data-rot="45" data-color="#cea864" className="pointer-events-none invisible absolute top-1/2 left-1/2 hidden size-full -translate-1/2 rotate-45 lg:block">
            {/* After the diamond, the square shrinks towards the lower point, clear of the label. */}
            <span data-square-anchor="network-compact" data-rot="45" data-color="#cea864" className="absolute top-[78%] left-[78%] block size-2 -translate-1/2" />
          </span>
          <Cta data-viewall href="/about" variant="text" size="sm" className="relative">
            {t("viewAll")}
          </Cta>
        </div>
      </div>

      <div data-network-viewport className="mt-10 overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:mt-4 lg:motion-safe:overflow-visible">
        <ul data-network-track aria-label={t("title")} className="flex w-max snap-x snap-mandatory gap-7 px-[clamp(1.25rem,5.3vw,5rem)] pb-2">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} locale={locale} />
          ))}
        </ul>
      </div>
    </section>
  );
}
