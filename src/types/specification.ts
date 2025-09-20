// src/types/specification.ts

export interface SpecificationGroup {
  id: number;
  name: string;
}

// Ini adalah tipe untuk item spesifikasi master
export interface SpecificationItem {
  id: number;
  name: string;
  unit?: string | null;
  specification_group: SpecificationGroup;
}