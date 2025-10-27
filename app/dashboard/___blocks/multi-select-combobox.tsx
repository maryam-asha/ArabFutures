"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export interface Option {
  value: number;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: number[];
  onChange: (selected: number[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelectCombobox({ options, selected, onChange, className, placeholder = "Select..." }: MultiSelectProps) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = React.useState(false);

  const selectedOptions = selected.map((val) => options.find((opt) => opt.value === val)).filter(Boolean) as Option[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-auto", className)}>
          <div className="flex gap-1 flex-wrap">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selected.filter((v) => v !== option.value));
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span>{placeholder || t("forms.placeholders.select")}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t("forms.placeholders.search")} />
          <CommandList>
            <CommandEmpty>{t("tables.noResults")}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newSelected = selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value];
                    onChange(newSelected);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
