// src/types/motor.ts
import type { Brand } from './brand';

export interface Category {
  id: number;
  name: string;
  desc?: string | null;
  image?: string | null;
}

// Tipe untuk item fitur
export interface Feature {
  id: number;
  feature_item: {
    id: number;
    name: string;
  };
}

// Tipe untuk gambar
export interface MotorImage {
  id: number;
  image_url: string;
  caption?: string | null;
}

// Tipe untuk grup spesifikasi
export interface SpecificationGroup {
    id: number;
    name: string;
}

// Tipe untuk item spesifikasi
export interface Specification {
  id: number;
  value: string;
  specification_item: {
    id: number;
    name: string;
    unit?: string | null;
    specification_group: SpecificationGroup;
  };
}

// Tipe utama untuk Motor
export interface Motor {
  id: number;
  name: string;
  year_model: string;
  engine_cc: number;
  low_price: number;
  up_price: number;
  desc?: string | null;
  brand: Brand;
  category: Category;
  features: Feature[];
  images: MotorImage[];
  specifications: Specification[];
}