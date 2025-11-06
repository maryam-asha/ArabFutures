import { Link } from "@i18n/navigation";
import { Button } from "@ui/button";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

interface Feature {
  id: string;
  heading: string;
  subheading: string;
  label: string;
  description: string;
  image: string;
  url: string;
}

const ProjectSection = async () => {
  const t = await getTranslations("Public.projects");
  const locale = await getLocale();
  const title = t("title");
  const features: Feature[] = t.raw("features");

  return (
    <section id="projects">
      <div className="container mx-auto">
        <div className="mx-auto mb-16  text-center">
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">{title}</h2>
        </div>

        <div className="mx-auto ">
          {features.map((feature) => (
            <div key={feature.id} className="grid items-center gap-8 overflow-hidden rounded-2xl bg-background shadow-lg md:grid-cols-2 md:gap-0">
              {/* Image Column */}
              <div className="relative h-64 md:h-full w-full">
                <Image src={feature.image} alt={feature.heading} fill className="object-cover object-[25%_75%] " sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content Column */}
              <div className="flex flex-col justify-between p-8 md:p-10 lg:p-12 h-full">
                <div>
                  <span className="text-primary font-semibold uppercase tracking-wider">{feature.label}</span>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{feature.heading}</h3>
                  <p className="mt-1 text-lg text-muted-foreground">{feature.subheading}</p>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
                <div className="mt-8">
                  <Button asChild size="lg" className="group w-full sm:w-auto">
                    <Link href={feature.url}>
                      {t("viewProject")} {/* Assumes 'viewProject' key exists */}
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${locale === "ar" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
