// components/ui/combobox.tsx

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Tentukan tipe props untuk komponen kita
interface ComboboxProps {
  options: { value: number; label: string }[];
  selectedValue?: number;
  onSelect: (value: number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundText?: string;
}

export function Combobox({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  notFoundText = "No option found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-zinc-900 border-white/20 hover:bg-zinc-800 hover:text-white"
        >
          {selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-white/20 text-white">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{notFoundText}</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label} // CommandItem value should be string for searchability
                onSelect={(currentValue) => {
                  // Find the option by label to get its numeric value
                  const selectedOption = options.find(opt => opt.label.toLowerCase() === currentValue.toLowerCase());
                  if (selectedOption) {
                    onSelect(selectedOption.value);
                  }
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}