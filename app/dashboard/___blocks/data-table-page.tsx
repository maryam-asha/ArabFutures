import { cn } from "@lib/utils";
import React from "react";

const DataTablePage = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("space-y-6", className)} {...props} />;

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex items-center justify-between", className)} {...props} />;

const Title = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className={cn("afs-display text-3xl tracking-tight", className)} {...props} />;

const Actions = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex items-center gap-2", className)} {...props} />;

const TableContainer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("bg-card p-6 rounded-lg border", className)} {...props} />;

DataTablePage.Header = Header;
DataTablePage.Title = Title;
DataTablePage.Actions = Actions;
DataTablePage.Table = TableContainer;

export { DataTablePage };
