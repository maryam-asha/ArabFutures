/**
 * PLACEHOLDER network members.
 *
 * There is no members table yet. Names and roles mirror the Figma mock-ups so the Growing Network
 * section can be designed and animated; replace this list (or back it with a DAL query) once real
 * member profiles exist. Portraits are intentionally generated monograms, not stock photos.
 */

export type NetworkMember = {
  id: string;
  name: { en: string; ar: string };
  role: { en: string; ar: string };
  /** Optional public links; icons are only rendered for links that exist. */
  links?: { email?: string; linkedin?: string; website?: string };
};

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
