import { getTranslations } from "next-intl/server";

export default async function AboutSection() {
  const t = await getTranslations("Public.about");
  const values = t.raw("values");

  return (
    <section id="about" className="scroll-mt-36">
      <div className="container mx-auto space-y-8 md:space-y-16 lg:space-y-24">
        {/* --- Original About Intro --- */}
        <div className="block lg:flex text-center md:text-left items-center rtl:text-center">
          <h1 className="text-5xl font-bold me-8 min-w-48">{t("title")}</h1>
          {/* <p className="text-lg text-muted-foreground">{t.rich("p1", { br: () => <br /> })}</p> */}
        </div>

        {/* --- Original Values Section --- */}
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

        <div id="vision" className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 lg:p-16 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div className="flex flex-col gap-4 text-center md:text-start">
              <h2 className="text-4xl font-bold">{t("vision.title")}</h2>
              <p className="text-xl text-primary-foreground/80">{t("vision.text")}</p>
            </div>
            <div className="flex flex-col gap-4 text-center md:text-start">
              <h2 className="text-4xl font-bold">{t("mission.title")}</h2>
              <p className="text-xl text-primary-foreground/80">{t("mission.text")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
