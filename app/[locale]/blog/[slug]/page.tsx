import { AppLocale } from "@i18n/config";
import { Link } from "@i18n/navigation";
import { findBlogPostBySlug } from "@root/dal/blog-dx";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await findBlogPostBySlug({ slug, locale: locale as AppLocale }).catch(() => null);
  if (!post) return {};
  const title = post.content.title?.[locale as AppLocale] || post.content.title?.en || "";
  const description = post.content.excerpt?.[locale as AppLocale] || post.content.excerpt?.en || "";
  return { title, description };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const post = await findBlogPostBySlug({ slug, locale });
  if (!post) notFound();

  const t = await getTranslations("Public.blog");
  const c = post.content;
  const title = c.title?.[locale] || c.title?.en || "—";
  const body = c.body?.[locale] || c.body?.en || c.excerpt?.[locale] || c.excerpt?.en || "";
  const meta = [c.date, c.readTime].filter(Boolean).join(" · ");

  return (
    <article className="afs-container py-14 lg:py-20">
      <Link href="/blog" className="afs-label text-light/70 hover:text-gold inline-flex items-center gap-2 text-sm">
        <ArrowLeft aria-hidden className="size-4 rtl:-scale-x-100" />
        {t("backToBlog")}
      </Link>

      <header className="mx-auto mt-8 max-w-[52rem]">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="bg-gold text-ink px-2.5 py-1 text-xs font-medium">{t("badge")}</span>
          {post.categoryName && <span className="text-gold">{post.categoryName}</span>}
          {meta && <span className="text-light/60">{meta}</span>}
        </div>
        <h1 className="afs-display text-light mt-4 text-[clamp(2.2rem,4.4vw,3.4rem)] leading-tight">{title}</h1>
      </header>

      {c.coverImageUrl && (
        <div className="mx-auto mt-8 max-w-[64rem]">
          <div className="relative aspect-[16/9] overflow-hidden bg-[linear-gradient(160deg,#2f2f2f,#1a1a1a)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary external URLs. */}
            <img src={c.coverImageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div className="text-light/85 mx-auto mt-10 max-w-[52rem] text-lg leading-relaxed whitespace-pre-line">{body}</div>

      {post.tags.length > 0 && (
        <ul className="mx-auto mt-10 flex max-w-[52rem] flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag.tagId} className="bg-ink-deep text-light/85 px-3 py-1 text-xs font-medium">
              {tag.name[locale] || tag.name.en}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
