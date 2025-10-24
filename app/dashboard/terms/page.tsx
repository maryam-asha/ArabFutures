import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { findTerms } from "@root/dal/terms-dx";
import { Plus } from "lucide-react";
import Link from "next/link";

import { DataTable } from "../___blocks/data-table";
import { termColumns } from "./___blocks/term-table-columns";

export default async function TermsPage() {
  const terms = await findTerms({
    locale: i18nAppConfig.defaultLocale,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lexicon Terms</h1>
        <Button asChild>
          <Link href="/dashboard/terms/create">
            <Plus className="w-4 h-4 mr-2" />
            Add New Term
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={termColumns} data={terms} />
      </div>
    </div>
  );
}
