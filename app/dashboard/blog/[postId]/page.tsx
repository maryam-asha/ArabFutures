import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { getTagOptionsAction } from "@app/dashboard/tags/actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { getIdFromParams } from "@lib/action-handler";
import { findBlogPostById } from "@root/dal/blog-dx";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogPostForm } from "../___blocks/post-form";
import { BlogPostFormValues } from "../post.types";

export default async function EditBlogPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const postId = await getIdFromParams(params, "postId");
  const locale = i18nAppConfig.defaultLocale;

  const [post, categories, tags] = await Promise.all([findBlogPostById({ postId, locale }), getActiveCategoryOptionsAction(locale), getTagOptionsAction(locale)]);

  if (!post) notFound();

  const t = await getTranslations();
  const c = post.content;

  const initialData: Partial<BlogPostFormValues> = {
    postId: post.postId,
    slug: post.slug,
    categoryRef: post.categoryRef ?? undefined,
    isActive: post.isActive,
    isFeatured: post.isFeatured,
    displayOrder: post.displayOrder,
    tagIds: post.tagIds,
    content: {
      title: { en: c.title?.en ?? "", ar: c.title?.ar ?? "" },
      excerpt: { en: c.excerpt?.en ?? "", ar: c.excerpt?.ar ?? "" },
      body: { en: c.body?.en ?? "", ar: c.body?.ar ?? "" },
      coverImageUrl: c.coverImageUrl ?? "",
      date: c.date ?? "",
      readTime: c.readTime ?? "",
    },
  };

  const title = c.title?.[locale] || c.title?.en || `Post #${postId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.blog.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.blog.editDescription", { entityName: title })}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <BlogPostForm initialData={initialData} categories={categories} tags={tags}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/blog">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </BlogPostForm>
      </FormPageContent>
    </FormPage>
  );
}
