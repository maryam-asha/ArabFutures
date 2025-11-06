import { z } from "zod";

import { TermCreate, TermNameTranslations } from "../types/term";

/**
 * Normalize payload shape, ensure locales keys are lowercased and trimmed,
 * ensure entries arrays are in consistent order and references arrays exist.
 */
export function normalizeTermCreate(payload: Partial<TermCreate>): TermCreate {
  const slug = (payload.slug ?? "").trim();
  const status = (payload.status ?? "draft") as any;

  const name: TermNameTranslations = {};
  if (!payload.name) throw new Error("name translations required");
  for (const [localeRaw, arr] of Object.entries(payload.name)) {
    const locale = localeRaw.trim().toLowerCase();
    if (!Array.isArray(arr) || arr.length === 0) continue;
    name[locale] = arr.map((entry: any) => {
      const refs = Array.isArray(entry.references)
        ? entry.references.map((r: any) => ({
            label: r.label ?? null,
            url: r.url ?? null,
          }))
        : [];
      return {
        value: String(entry.value ?? "").trim(),
        references: refs,
      };
    });
  }

  const translations = payload.translations ?? {};

  const createSchema = z.object({
    slug: z.string().min(1),
    status: z.enum(["draft", "published", "archived"]),
    name: z.record(
      z.string(),
      z.array(
        z.object({
          value: z.string().min(1),
          references: z.array(z.object({ label: z.string().optional(), url: z.string().url().optional() })).optional(),
        }),
      ),
    ),
    translations: z.record(z.string(), z.object({ brief: z.string().optional(), full: z.string().optional() })).optional(),
  });

  const parsed = createSchema.parse({ slug, status, name, translations });
  return parsed;
}
