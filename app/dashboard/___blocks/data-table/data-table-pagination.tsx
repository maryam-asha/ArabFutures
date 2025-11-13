"use client";

import { Button } from "@components/ui/button";
import { Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const t = useTranslations("Dashboard.tables");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("limit") || 10);

  const totalCount = table.options.rowCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const updateParams = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {t("selectedRows", {
          count: table.getFilteredSelectedRowModel().rows.length,
          total: totalCount,
        })}
      </div>

      <div className="flex items-center space-x-2 md:space-x-6 lg:space-x-8">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("rowsPerPage")}</p>
          <Select value={`${pageSize}`} onValueChange={(val) => updateParams({ limit: val, page: 1 })}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((s) => (
                <SelectItem key={s} value={`${s}`}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page indicator */}
        <div className="flex w-[120px] items-center justify-center text-sm font-medium">{t("pageIndicator", { page: currentPage, totalPages })}</div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => updateParams({ page: 1 })} disabled={!canPrev}>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>

          <Button variant="outline" className="h-8 w-8 p-0" onClick={() => updateParams({ page: currentPage - 1 })} disabled={!canPrev}>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>

          <Button variant="outline" className="h-8 w-8 p-0" onClick={() => updateParams({ page: currentPage + 1 })} disabled={!canNext}>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>

          <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => updateParams({ page: totalPages })} disabled={!canNext}>
            <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
