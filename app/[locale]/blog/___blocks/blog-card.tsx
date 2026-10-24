import { AppLocale } from "@i18n/config";
import { Link } from "@i18n/navigation";
import type { BlogPostDb } from "@root/dal/dal.types";
import { useTranslations } from "next-intl";

/** Blog listing card: cover image with a "Blog" badge, then date · read time, title, excerpt and tags. */
export function BlogCard({ post, locale }: { post: BlogPostDb; locale: AppLocale }) {
  const t = useTranslations("Public.blog");
  const c = post.content;
  const title = c.title?.[locale] || c.title?.en || c.title?.ar || "—";
  const excerpt = c.excerpt?.[locale] || c.excerpt?.en || "";
  const meta = [c.date, c.readTime].filter(Boolean).join(" · ");
  const href = `/blog/${post.slug}`;

  return (
    <article className="group flex h-full flex-col">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-[linear-gradient(160deg,#2f2f2f,#1a1a1a)]">
        {c.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- cover images are arbitrary external URLs.
          <img src={c.coverImageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <span className="bg-gold text-ink absolute end-4 top-4 px-2.5 py-1 text-xs font-medium">{t("badge")}</span>
      </Link>

      <div className="mt-4 flex grow flex-col">
        {meta && <p className="text-light/60 text-xs">{meta}</p>}
        <h3 className="mt-2">
          <Link href={href} className="text-light hover:text-gold text-xl leading-tight font-semibold transition-colors">
            {title}
          </Link>
        </h3>
        {excerpt && <p className="text-light/75 mt-2 line-clamp-2 text-sm leading-relaxed">{excerpt}</p>}
        {post.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag.tagId} className="bg-ink-deep text-light/85 px-3 py-1 text-xs font-medium">
                {tag.name[locale] || tag.name.en}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
