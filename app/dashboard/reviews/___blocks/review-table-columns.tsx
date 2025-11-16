"use client";

import { Button } from "@components/ui/button";
import { TermReviewWithTermName } from "@root/dal/dal.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const reviewColumns: ColumnDef<TermReviewWithTermName>[] = [
  {
    accessorKey: "termName",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return t("name");
    },
    cell: ({ row }) => (
      <Link href={`/dashboard/terms/${row.original.termRef}`} className="font-medium hover:underline">
        {row.original.termName}
      </Link>
    ),
  },

  {
    accessorKey: "suggestedValue",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return t("SuggestedChange");
    },
    cell: ({ row }) => {
      return <div className="text-sm font-semibold text-primary truncate max-w-xs">{row.original.suggestedChange}</div>;
    },
  },
  {
    accessorKey: "explanation",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return t("explanation");
    },
    cell: ({ row }) => <div className="text-sm text-muted-foreground truncate max-w-xs">{row.original.explanation || "-"}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const review = row.original;
      const t = useTranslations("Common.actions");

      return (
        <div className="text-right">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/terms/${review.termRef}?reviewId=${review.reviewId}`}>
              {t("review")}
              <ArrowLeft className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
