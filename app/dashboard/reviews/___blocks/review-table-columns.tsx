"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { TermReviewWithTermName } from "@root/dal/reviews-dx";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { approveReviewAction, rejectReviewAction } from "../actions";

// Helper component for the Diff column
const DiffViewer = ({ oldValue, newValue }: { oldValue: string; newValue: string }) => {
  return (
    <div className="flex flex-col gap-1 text-xs">
      <span className="text-muted-foreground line-through">{oldValue}</span>
      <div className="flex items-center gap-1 font-medium text-green-600">
        <ArrowRight className="h-3 w-3 shrink-0" />
        <span>{newValue}</span>
      </div>
    </div>
  );
};

// Helper component for the Action buttons
const ReviewActionButtons = ({ review }: { review: TermReviewWithTermName }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { csrfToken, setCsrfToken } = useReactiveCsrf();
  const t = useTranslations("Common.actions");

  const handleAction = (action: typeof approveReviewAction | typeof rejectReviewAction) => {
    const formData = new FormData();
    formData.append("reviewId", review.reviewId.toString());
    formData.append("csrf_token", csrfToken);

    startTransition(() => {
      toast.promise(action({} as any, formData), {
        loading: "Processing...",
        success: (result) => {
          if (result.success) {
            if (result.newCsrfToken) setCsrfToken(result.newCsrfToken);
            router.refresh();
            return result.message;
          }
          throw new Error(result.message);
        },
        error: (err) => err.message,
      });
    });
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button size="sm" variant="outline" onClick={() => handleAction(approveReviewAction)} disabled={isPending}>
        <Check className="h-4 w-4 mr-1" />
        {t("approve")}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => handleAction(rejectReviewAction)} disabled={isPending}>
        <X className="h-4 w-4 mr-1" />
        {t("reject")}
      </Button>
    </div>
  );
};

export const reviewColumns: ColumnDef<TermReviewWithTermName>[] = [
  {
    accessorKey: "termName",
    header: "Term",
    cell: ({ row }) => (
      <Link href={`/dashboard/terms/${row.original.termRef}`} className="font-medium hover:underline">
        {row.original.termName}
      </Link>
    ),
  },
  {
    accessorKey: "fieldKey",
    header: "Field",
    cell: ({ row }) => <Badge variant="secondary">{row.original.fieldKey}</Badge>,
  },
  {
    header: "Suggested Change",
    cell: ({ row }) => {
      // In a real app, you'd fetch the original value to show a proper diff.
      // For this implementation, we'll just show the suggestion.
      return <div className="text-sm font-semibold">{row.original.suggestedValue}</div>;
    },
  },
  {
    accessorKey: "explanation",
    header: "Explanation",
  },
  {
    id: "actions",
    cell: ({ row }) => <ReviewActionButtons review={row.original} />,
  },
];
