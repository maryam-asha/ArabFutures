import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { Link } from "@i18n/navigation";
import { findBlogPosts, findFeaturedBlogPosts } from "@root/dal/blog-dx";
import type { BlogPostDb } from "@root/dal/dal.types";
import { AppLocale } from "@root/i18n/config";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { FailedToLoad } from "../___blocks/failed-to-load";
import { GetInvolvedSection } from "../___blocks/home/closing-sections";
import { BlogExplorer } from "./___blocks/blog-explorer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.blog" });
  const siteName = await getTranslations({ locale, namespace: "Public.metadata" }).then((tt) => tt("siteName"));
  return {
    title: `${t("title")} | ${siteName}`,
    description: t("subtitle"),
    alternates: { canonical: `/${locale}/blog`, languages: { en: "/en/blog", ar: "/ar/blog" } },
  };
}

function FeaturedItem({ post, locale }: { post: BlogPostDb; locale: AppLocale }) {
  const c = post.content;
  const title = c.title?.[locale] || c.title?.en || "—";
  const excerpt = c.excerpt?.[locale] || c.excerpt?.en || "";
  const meta = [c.date, c.readTime].filter(Boolean).join(" · ");
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className="group flex gap-5">
        <span className="relative hidden size-24 shrink-0 overflow-hidden bg-[linear-gradient(160deg,#2f2f2f,#1a1a1a)] sm:block">
          {c.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary external URLs.
            <img src={c.coverImageUrl} alt="" className="h-full w-full object-cover" />
          )}
        </span>
        <span className="min-w-0">
          {meta && <span className="text-light/60 block text-xs">{meta}</span>}
          <span className="text-light group-hover:text-gold mt-1 block text-lg leading-tight font-semibold transition-colors">{title}</span>
          {excerpt && <span className="text-light/70 mt-1 line-clamp-2 block text-sm leading-relaxed">{excerpt}</span>}
        </span>
      </Link>
    </li>
  );
}

async function BlogTop() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.blog");
  const featured = await findFeaturedBlogPosts(locale, 3).catch(() => []);

  return (
    <section className="afs-container grid gap-12 pt-12 pb-14 lg:grid-cols-2 lg:pt-16">
      <div>
        <h1 className="afs-display text-light text-[clamp(2.8rem,5.6vw,4.75rem)] leading-[0.95]">{t("title")}</h1>
        <p className="text-light/90 mt-5 max-w-[34rem] text-lg leading-relaxed">{t("subtitle")}</p>
      </div>
      {featured.length > 0 && (
        <div>
          <h2 className="afs-label text-light text-sm">{t("featured")}</h2>
          <ul className="mt-5 space-y-7">
            {featured.map((post) => (
              <FeaturedItem key={post.postId} post={post} locale={locale} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

async function BlogExplore() {
  const locale = (await getLocale()) as AppLocale;
  const data = await Promise.all([findBlogPosts({ locale, activeOnly: true, limit: 9 }), getActiveCategoryOptionsAction(locale)]).catch((error) => {
    console.error("Blog: failed to load", error);
    return null;
  });

  if (!data) {
    return (
      <div className="afs-container">
        <FailedToLoad />
      </div>
    );
  }

  const [initial, categories] = data;
  return <BlogExplorer initialPosts={initial.data} initialHasMore={initial.data.length < initial.totalCount} categories={categories} />;
}

export default async function BlogPage() {
  return (
    <>
      <BlogTop />
      <BlogExplore />
      <GetInvolvedSection />
    </>
  );
}
