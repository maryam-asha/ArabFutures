import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { getTagOptionsAction } from "@app/dashboard/tags/actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BlogPostForm } from "../___blocks/post-form";

export default async function CreateBlogPostPage() {
  const t = await getTranslations();
  const locale = i18nAppConfig.defaultLocale;
  const [categories, tags] = await Promise.all([getActiveCategoryOptionsAction(locale), getTagOptionsAction(locale)]);

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.blog.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.blog.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <BlogPostForm initialData={{}} categories={categories} tags={tags}>
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
