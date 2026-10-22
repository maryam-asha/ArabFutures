import { getTranslations } from "next-intl/server";

type Feature = { label?: string; heading: string; description: string };

export default async function OurWorkSection() {
  const t = await getTranslations("Public.ourWork");
  const features = t.raw("features") as Feature[];

  return (
    <section id="work" className="afs-container py-20 lg:py-28">
      <h2 className="afs-display text-light text-[clamp(2.6rem,4.2vw,3.6rem)]">{t("title")}</h2>
      <div className="mt-12 grid grid-cols-1 gap-px bg-[var(--border)] lg:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.heading} className="bg-ink p-8 md:p-10">
            {feature.label && <span className="afs-label text-gold">{feature.label}</span>}
            <h3 className="afs-display text-light mt-3 text-[2rem]">{feature.heading}</h3>
            <p className="text-light/85 mt-3 text-lg leading-relaxed">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
