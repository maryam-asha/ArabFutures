import { getTranslations } from "next-intl/server";

type Value = { label: string; value: string };

/** About content (approved copy). Interim layout for /about until the About Us designs arrive. */
export default async function AboutSection() {
  const t = await getTranslations("Public.about");
  const values = Object.values(t.raw("values") as Record<string, Value>);

  return (
    <section id="about" className="afs-container pt-16 pb-12 lg:pt-24">
      <h1 className="afs-display text-light text-[clamp(3rem,6vw,5.5rem)]">
        {t("title")}
        <span aria-hidden className="bg-gold ms-[0.18em] inline-block size-[0.14em] align-baseline" />
      </h1>

      <div className="mt-16 grid gap-px bg-[var(--border)] lg:grid-cols-3">
        <div className="bg-gold text-ink flex flex-col justify-between gap-6 p-8 md:p-10">
          <h2 className="afs-display text-[2.4rem]">{t("breakoutTitle")}</h2>
          <p className="text-ink/85 text-lg leading-relaxed">{t("breakoutDescription")}</p>
        </div>
        <div className="bg-ink p-8 md:p-10 lg:col-span-2">
          <h2 className="afs-display text-light text-[2.4rem]">{t("valuesTitle")}</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.label} className="border-gold border-s-2 ps-5">
                <h3 className="text-gold text-lg font-semibold">{value.label}</h3>
                <p className="text-light/85 mt-1 leading-relaxed">{value.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="vision" className="mt-20 grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="afs-display text-gold text-[clamp(2.4rem,4vw,3.4rem)]">{t("mission.title")}</h2>
          <p className="text-light/90 mt-5 text-xl leading-relaxed">{t("mission.text")}</p>
        </div>
        <div>
          <h2 className="afs-display text-gold-pale text-[clamp(2.4rem,4vw,3.4rem)]">{t("vision.title")}</h2>
          <p className="text-light/90 mt-5 text-xl leading-relaxed">{t("vision.text")}</p>
        </div>
      </div>
    </section>
  );
}
