// components/ui/MotorSearchCombobox.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMotors } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";

interface MotorSearchComboboxProps {
  selectedValue?: Motor;
  onSelect: (motor?: Motor) => void;
  excludeId?: number; // Untuk mencegah motor yang sama dipilih
  placeholder?: string;
}

export function MotorSearchCombobox({
  selectedValue,
  onSelect,
  excludeId,
  placeholder = "Pilih motor...",
}: MotorSearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [searchResults, setSearchResults] = React.useState<Motor[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchMotors(debouncedSearchQuery);
        // Filter motor yang sudah dipilih di sisi lain
        setSearchResults(excludeId ? data.filter(m => m.id !== excludeId) : data);
      } catch (error) {
        console.error("Gagal mencari motor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchQuery, excludeId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-zinc-900 border-white/20 hover:bg-zinc-800 hover:text-white"
        >
          <span className="truncate">
            {selectedValue ? `${selectedValue.brand.name} ${selectedValue.name} ${selectedValue.year_model}` : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-white/20 text-white">
        <Command>
          <CommandInput
            placeholder="Ketik untuk mencari motor..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
           <CommandEmpty>
            {loading ? (
              <div className="flex justify-center items-center p-2">
                <Loader2 className="animate-spin" />
              </div>
            ) : "Motor tidak ditemukan."}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {searchResults.map((motor) => (
              <CommandItem
                key={motor.id}
                value={`${motor.brand.name} ${motor.name} ${motor.year_model}`}
                onSelect={() => {
                  onSelect(motor);
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", selectedValue?.id === motor.id ? "opacity-100" : "opacity-0")} />
                {motor.brand.name} {motor.name} ({motor.year_model})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}