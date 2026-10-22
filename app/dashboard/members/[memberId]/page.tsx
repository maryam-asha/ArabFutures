import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getIdFromParams } from "@lib/action-handler";
import { findMemberById } from "@root/dal/members-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MemberForm } from "../___blocks/member-form";
import { MemberFormValues } from "../member.types";

export default async function EditMemberPage({ params }: { params: Promise<{ memberId: string }> }) {
  const memberId = await getIdFromParams(params, "memberId");
  const member = await findMemberById(memberId);

  if (!member) notFound();

  const t = await getTranslations();
  const c = member.content;

  // Map the DB content (locale-record shape) onto the form's fixed { en, ar } shape.
  const initialData: Partial<MemberFormValues> = {
    memberId: member.memberId,
    slug: member.slug,
    displayOrder: member.displayOrder,
    isActive: member.isActive,
    isFeatured: member.isFeatured,
    content: {
      photoUrl: c.photoUrl ?? "",
      name: { en: c.name?.en ?? "", ar: c.name?.ar ?? "" },
      role: { en: c.role?.en ?? "", ar: c.role?.ar ?? "" },
      social: { email: c.social?.email ?? "", linkedin: c.social?.linkedin ?? "", website: c.social?.website ?? "" },
      roleWithinAsf: { en: c.roleWithinAsf?.en ?? "", ar: c.roleWithinAsf?.ar ?? "" },
      professionalProfile: { en: c.professionalProfile?.en ?? "", ar: c.professionalProfile?.ar ?? "" },
      favoriteWord: {
        word: { en: c.favoriteWord?.word?.en ?? "", ar: c.favoriteWord?.word?.ar ?? "" },
        explanation: { en: c.favoriteWord?.explanation?.en ?? "", ar: c.favoriteWord?.explanation?.ar ?? "" },
      },
      works: (c.works ?? []).map((w) => ({
        imageUrl: w.imageUrl ?? "",
        type: w.type ?? "",
        date: w.date ?? "",
        readTime: w.readTime ?? "",
        url: w.url ?? "",
        title: { en: w.title?.en ?? "", ar: w.title?.ar ?? "" },
        description: { en: w.description?.en ?? "", ar: w.description?.ar ?? "" },
        tags: w.tags ?? [],
      })),
      links: (c.links ?? []).map((l) => ({
        label: { en: l.label?.en ?? "", ar: l.label?.ar ?? "" },
        url: l.url ?? "",
      })),
    },
  };

  const memberName = c.name?.[i18nAppConfig.defaultLocale] || c.name?.en || `Member #${memberId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.members.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.members.editDescription", { entityName: memberName })}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <MemberForm initialData={initialData}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/members">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </MemberForm>
      </FormPageContent>
    </FormPage>
  );
}
