import { Skeleton } from "@components/ui/skeleton";
import { getTranslations } from "next-intl/server";

export async function FeaturedTermsLoading() {
  const t = await getTranslations("Public.featuredTerms");
  return (
    <section id="featured-terms" className="scroll-mt-36">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-start">
            <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("description")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
