import { ServerAction } from "@lib/action-handler";
import { type ColumnDef } from "@tanstack/react-table";

/**
 * Defines the shape for a bulk action to be used in the DataTable toolbar.
 */
export interface BulkAction {
  label: string;
  action: ServerAction<any>; //
  actionType?: string;
  isDestructive?: boolean;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumnId?: string;
  filterColumnPlaceholder?: string;
  bulkActions?: BulkAction[];
  pkColumn: keyof TData;
}
