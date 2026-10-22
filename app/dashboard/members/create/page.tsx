import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { MemberForm } from "../___blocks/member-form";

export default async function CreateMemberPage() {
  const t = await getTranslations();

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.members.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.members.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <MemberForm initialData={{}}>
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
