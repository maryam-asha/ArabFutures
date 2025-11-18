import { getTranslations } from "next-intl/server";

export default async function OurWorkSection() {
  const t = await getTranslations("Public.ourWork");
  const features = t.raw("features");

  return (
    <section id="work" className="scroll-mt-36">
      <div className="container mx-auto py-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-pretty text-4xl font-bold lg:text-5xl mb-12">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 space-y-4">
          {features.map((feature: any, index: number) => (
            <div key={index} className="bg-muted/50 flex flex-col rounded-2xl overflow-hidden">
              <div className="p-8">
                <span className="text-primary  text-sm font-semibold">{feature.label}</span>
                <h3 className="text-3xl font-bold mt-4 mb-2">{feature.heading}</h3>
                <p className="text-muted-foreground text-lg">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
