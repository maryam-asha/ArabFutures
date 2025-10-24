import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { findFeaturedTerms } from "@root/dal/terms-dx";
import { AppLocale } from "@root/i18n/config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Helper function to get the primary translation for a term
function getTermTranslation(term: any, locale: AppLocale) {
  return term.translations?.[locale] || { title: "No Title", briefDescription: "No description available." };
}

// =================================================================
// 1. Hero Section Component
// =================================================================
function HeroSection() {
  return (
    <section className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-16 text-center lg:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Foresight Platform</span>
          <span className="block text-primary">Explore Future Concepts</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-gray-500 dark:text-gray-400 sm:max-w-xl">Dive into a curated lexicon of emerging trends, technologies, and ideas shaping our future.</p>
        <div className="mx-auto mt-8 max-w-sm sm:flex sm:max-w-none sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// =================================================================
// 2. Featured Terms Section Component
// =================================================================
function FeaturedTermsSection({ terms, locale }: { terms: any[]; locale: AppLocale }) {
  if (!terms || terms.length === 0) {
    return null; // Don't render the section if there are no featured terms
  }

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Terms</h2>
          <p className="mt-4 text-lg text-gray-600">A handpicked selection of key concepts from our lexicon.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {terms.map((term) => {
            const translation = getTermTranslation(term, locale);
            return (
              <Card key={term.termId} className="flex flex-col">
                <CardHeader>
                  {term.categoryName && (
                    <CardDescription>
                      In Category: <span className="font-semibold text-primary">{term.categoryName}</span>
                    </CardDescription>
                  )}
                  <CardTitle>{translation.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{translation.briefDescription}</p>
                  {term.tags && term.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {term.tags.map((tag: any) => (
                        <Badge key={tag.tagId} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/${locale}/terms/${term.termId}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// =================================================================
// 3. Main Page Component (Server Component)
// =================================================================
export default async function LandingPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params;

  // Fetch the featured terms on the server
  const featuredTerms = await findFeaturedTerms(locale);

  return (
    <div>
      <HeroSection />
      <FeaturedTermsSection terms={featuredTerms} locale={locale} />
    </div>
  );
}
