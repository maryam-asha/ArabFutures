"use client";

import { Button } from "@components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ArrayPath, Control, FieldValues, useFieldArray } from "react-hook-form";

/**
 * Intelligently adds https:// to a URL if it's missing a protocol.
 * @param url The string to check.
 * @returns The corrected URL or the original string.
 */
const autoPrefixUrl = (url: string): string => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return "";
  }
  if (/^(\w+:\/\/)/.test(trimmedUrl) || !trimmedUrl.includes(".")) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
};

interface ReferencesFieldProps<T extends FieldValues> {
  control: Control<T>;
  path: ArrayPath<T>;
}

export function ReferencesField<T extends FieldValues>({ control, path }: ReferencesFieldProps<T>) {
  const t = useTranslations("Dashboard.forms.labels");
  const { fields, append, remove } = useFieldArray({
    control,
    name: path,
  });

  return (
    <div className="space-y-4 pt-4">
      <Separator />
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{t("references")}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ content: "", url: "" } as any)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addReference")}
        </Button>
      </div>
      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 p-3 border rounded-md bg-muted/50">
          <FormField
            control={control}
            name={`${path}.${index}.content` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("referenceContent")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${path}.${index}.url` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("referenceUrl")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    onBlur={(e) => {
                      const correctedUrl = autoPrefixUrl(e.target.value);
                      field.onChange(correctedUrl);
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="self-end text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
