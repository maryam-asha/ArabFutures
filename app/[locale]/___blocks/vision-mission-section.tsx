import { getTranslations } from "next-intl/server";

export default async function VisionMissionSection() {
  const t = await getTranslations("Public");

  return (
    <section id="vision" className="bg-primary p-8 scroll-mt-header">
      <div className="container mx-auto max-w-5xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 ">
          <div className="flex flex-col gap-4 text-center md:text-start">
            <h2 className="text-4xl font-bold text-accent">{t("vision.title")}</h2>
            <p className="text-xl text-accent">{t("vision.text")}</p>
          </div>
          <div className="flex flex-col gap-4 text-center md:text-start">
            <h2 className="text-4xl font-bold text-accent">{t("mission.title")}</h2>
            <p className="text-xl text-accent">{t("mission.text")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
