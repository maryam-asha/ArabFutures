import { getTranslations } from "next-intl/server";

export default async function AboutSection() {
  const t = await getTranslations("Public.about");
  const values = t.raw("values");

  return (
    <section id="about" className="container mx-auto py-8">
      <div className="mb-12 grid gap-5 text-center md:grid-cols-2 md:text-left items-center">
        <h1 className="text-5xl font-bold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("p1")}</p>
      </div>
      <div className="grid gap-7 lg:grid-cols-3">
        <div className="bg-primary text-primary-foreground flex flex-col justify-between gap-6 rounded-2xl p-8 lg:col-span-1">
          <h3 className="text-3xl font-bold">{t("breakoutTitle")}</h3>
          <p className="text-lg text-primary-foreground/80">{t("breakoutDescription")}</p>
        </div>
        <div className="bg-muted/50 rounded-2xl p-8 lg:col-span-2">
          <h3 className="text-3xl font-bold mb-6">{t("valuesTitle")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {Object.values(values).map((value: any, index: number) => (
              <div key={index}>
                <h4 className="font-semibold text-lg">{value.label}</h4>
                <p className="text-muted-foreground">{value.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
