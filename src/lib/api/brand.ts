// lib/api/brand.ts

import type { Brand, NewBrandData } from '@/types/brand';
import { fetchWithAuth } from '../api';

// Tipe untuk data formulir yang menyertakan file, berdasarkan tipe Anda
export type BrandFormData = Omit<NewBrandData, 'icon' | 'image'> & {
  icon?: File;
  image?: File;
};

/**
 * CREATE: Membuat brand baru.
 */
export const createBrand = async (brandData: BrandFormData): Promise<Brand> => {
  const hasFiles = brandData.icon || brandData.image;

  let body: FormData | string;
  const headers: HeadersInit = {}; // Perubahan: 'let' menjadi 'const'

  if (hasFiles) {
    const formData = new FormData();
    formData.append('name', brandData.name);
    if (brandData.desc) formData.append('desc', brandData.desc);
    if (brandData.icon) formData.append('icon', brandData.icon);
    if (brandData.image) formData.append('image', brandData.image);
    body = formData;
  } else {
    body = JSON.stringify({
      name: brandData.name,
      desc: brandData.desc,
    });
    // Ini adalah mutasi, bukan re-assignment, jadi 'const' valid.
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetchWithAuth<{ data: Brand }>('/motorinci/brands', {
    method: 'POST',
    headers,
    body,
  });
  return response.data;
};

/**
 * READ: Mengambil daftar semua brand dari server.
 */
export const getBrands = async (signal?: AbortSignal): Promise<Brand[]> => {
  const response = await fetchWithAuth<{ data: Brand[] }>('/motorinci/brands', { 
    signal, 
    method: 'GET' 
  });
  return response.data; // API Anda membungkus hasil dalam 'data'
};

/**
 * UPDATE: Mengupdate brand yang ada.
 * (Ini adalah contoh implementasi lengkap untuk nanti)
 */
export const updateBrand = async (id: number, brandData: Partial<BrandFormData>): Promise<Brand> => {
  const formData = new FormData();
  
  // Append hanya data yang diisi
  if (brandData.name) formData.append('name', brandData.name);
  if (brandData.desc) formData.append('desc', brandData.desc);
  if (brandData.icon) formData.append('icon', brandData.icon);
  if (brandData.image) formData.append('image', brandData.image);
  
  // Laravel memerlukan method spoofing untuk FormData dengan PUT/PATCH
  formData.append('_method', 'PUT'); 

  const response = await fetchWithAuth<{ data: Brand }>(`/motorinci/brands/${id}`, {
    method: 'POST', // Kirim sebagai POST
    body: formData,
  });
  return response.data;
};

/**
 * DELETE: Menghapus brand.
 */
export const deleteBrand = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/brands/${id}`, {
    method: 'DELETE',
  });
};