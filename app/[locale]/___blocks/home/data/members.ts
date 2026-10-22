/**
 * Fallback network members.
 *
 * Real members now live in the `members` table and are loaded via the DAL (see toNetworkMember).
 * This placeholder list is only used when no active members exist yet, so the Growing Network and
 * Ready-to-collaborate sections stay populated and animated. Portraits are generated monograms.
 */
import type { MemberDb } from "@root/dal/dal.types";

export type NetworkMember = {
  id: string;
  /** Present for DB-backed members; links the card to the member detail page. */
  slug?: string;
  /** Optional real portrait URL; falls back to a generated monogram when absent. */
  photoUrl?: string;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  /** Optional public links; icons are only rendered for links that exist. */
  links?: { email?: string; linkedin?: string; website?: string };
};

/** Maps a DB member row to the shape the public network / collaborate cards consume. */
export function toNetworkMember(member: MemberDb): NetworkMember {
  const { content } = member;
  const name = content.name ?? {};
  const role = content.role ?? {};
  return {
    id: String(member.memberId),
    slug: member.slug,
    photoUrl: content.photoUrl || undefined,
    name: { en: name.en || name.ar || "", ar: name.ar || name.en || "" },
    role: { en: role.en || role.ar || "", ar: role.ar || role.en || "" },
    links: content.social ? { email: content.social.email, linkedin: content.social.linkedin, website: content.social.website } : undefined,
  };
}

const FOUNDER = { en: "Futurist & AFS Founder", ar: "مستقبلية ومؤسِّسة الجمعية" };
const DIRECTOR = { en: "Director of Strategic Foresight", ar: "مديرة الاستشراف الاستراتيجي" };
const DIRECTOR_M = { en: "Director of Strategic Foresight", ar: "مدير الاستشراف الاستراتيجي" };
const PRACTITIONER = { en: "Foresight Practitioner", ar: "ممارسة في الاستشراف" };

export const NETWORK_MEMBERS: NetworkMember[] = [
  { id: "m1", name: { en: "Soha Rashed", ar: "سها راشد" }, role: FOUNDER },
  { id: "m2", name: { en: "Dr. Amira Hassan", ar: "د. أميرة حسن" }, role: DIRECTOR },
  { id: "m3", name: { en: "Dr. Hassan Amer", ar: "د. حسن عامر" }, role: DIRECTOR_M },
  { id: "m4", name: { en: "Rawan Mahmoud", ar: "روان محمود" }, role: PRACTITIONER },
  { id: "m5", name: { en: "Dr. Amira Hassan", ar: "د. أميرة حسن" }, role: DIRECTOR },
  { id: "m6", name: { en: "Dr. Hassan Amer", ar: "د. حسن عامر" }, role: DIRECTOR_M },
  { id: "m7", name: { en: "Rawan Mahmoud", ar: "روان محمود" }, role: PRACTITIONER },
  { id: "m8", name: { en: "Soha Rashed", ar: "سها راشد" }, role: FOUNDER },
];
