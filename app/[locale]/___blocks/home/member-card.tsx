import type { AppLocale } from "@i18n/config";
import { Globe, Linkedin, Mail } from "lucide-react";

import type { NetworkMember } from "./data/members";

function initials(name: string) {
  return name
    .replace(/^(Dr\.|د\.)\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

/** Monogram portrait placeholder: no stock photos until real member portraits exist. */
function Portrait({ name }: { name: string }) {
  return (
    <div aria-hidden className="relative aspect-[317/253] overflow-hidden bg-[linear-gradient(160deg,#2f2f2f_0%,#1a1a1a_70%)]">
      <span className="afs-display text-light/10 absolute inset-0 flex items-center justify-center text-[7rem] leading-none">{initials(name)}</span>
      <span className="bg-gold/70 absolute end-5 bottom-5 size-2" />
      <span className="bg-light/15 absolute inset-x-0 bottom-0 h-px" />
    </div>
  );
}

export function MemberCard({ member, locale, tone = "plain" }: { member: NetworkMember; locale: AppLocale; tone?: "plain" | "dark" }) {
  const name = member.name[locale];
  const role = member.role[locale];
  const links = member.links ?? {};
  const linkClass = "text-light/80 hover:text-gold transition-colors";

  return (
    <li data-member-card className="w-[min(78vw,19.8rem)] shrink-0 snap-start">
      <article className={tone === "dark" ? "bg-ink h-full pb-6" : undefined}>
        <Portrait name={name} />
        <div className="px-5 pt-5">
          <h3 className="afs-display text-gold text-[1.65rem] leading-tight">{name}</h3>
          <p className="text-light/85 mt-1 text-sm">{role}</p>
          {(links.email || links.linkedin || links.website) && (
            <div className="mt-5 flex items-center gap-4">
              {links.email && (
                <a href={`mailto:${links.email}`} className={linkClass} aria-label={`Email ${name}`}>
                  <Mail className="size-4" />
                </a>
              )}
              {links.linkedin && (
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${name} on LinkedIn`}>
                  <Linkedin className="size-4" />
                </a>
              )}
              {links.website && (
                <a href={links.website} target="_blank" rel="noopener noreferrer" className={linkClass} aria-label={`${name} website`}>
                  <Globe className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}
