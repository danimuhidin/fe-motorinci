// lib/api/motor.ts

import type { Motor, MotorImage } from '@/types/motor';
import type { Category } from '@/types/category';
import type { Brand } from '@/types/brand';
import { fetchWithAuth } from '../api';
import { publicFetch } from '../api';

interface CompareResponse {
  motor1: Motor;
  motor2: Motor;
}

export interface HomePageData {
  randomMotors: Motor[];
  categories: Category[];
  brands: Brand[];
}

export type MotorGeneralFormData = {
  name: string;
  brand_id: number;
  category_id: number;
  year_model: string;
  engine_cc: number;
  brochure_url?: string | null;
  sparepart_url?: string | null;
  low_price?: number | null;
  up_price?: number | null;
  desc?: string | null;
};
/**
 * READ (All): Mengambil daftar semua motor dari server.
 */
export const getMotors = async (signal?: AbortSignal): Promise<Motor[]> => {
  const response = await fetchWithAuth<{ data: Motor[] }>('/motorinci/motors', { 
    signal, 
    method: 'GET',
    next: {
      revalidate: 86400
    }
  });
  // Kita tambahkan parameter ?limit=1000 untuk mengambil semua data,
  // karena API Anda memiliki paginasi. Sesuaikan jika perlu.
  // const response = await fetchWithAuth<{ data: Motor[] }>('/motorinci/motors?limit=1000', { 
  //   signal, 
  //   method: 'GET' 
  // });
  return response.data;
};

/**
 * READ (by ID): Mengambil detail satu motor.
 * (Kita siapkan untuk halaman hasil perbandingan nanti)
 */
export const getMotorById = async (id: number, signal?: AbortSignal): Promise<Motor> => {
    const response = await fetchWithAuth<{ data: Motor }>(`/motorinci/motors/${id}`, {
        signal,
        method: 'GET',
    });
    return response.data;
};

export const searchMotors = async (query: string, signal?: AbortSignal): Promise<Motor[]> => {
  if (!query) return [];
  const response = await fetchWithAuth<{ data: Motor[] }>(`/motorinci/search-motors?search=${encodeURIComponent(query)}&limit=10`, { // Limit 10 suggest
    signal, 
    method: 'GET' 
  });
  return response.data || response;
};

export const getRandomMotors = async (limit: number = 5, signal?: AbortSignal): Promise<Motor[]> => {
  const response = await fetchWithAuth<any>(`/motorinci/motors/random?limit=${limit}`, {
    signal,
    method: 'GET',
    next: {
      revalidate: 86400
    }
  });
  return response.data || response;
}

export const compareMotors = async (id1: number, id2: number, signal?: AbortSignal): Promise<CompareResponse> => {
  const response = await fetchWithAuth<{ data: CompareResponse }>(`/motorinci/komparasi/${id1}/${id2}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const getHomePageData = async (signal?: AbortSignal): Promise<HomePageData> => {
  const response = await publicFetch<{ data: HomePageData }>('/motorinci/front/home', { 
    signal, 
    method: 'GET',
    next: {
      revalidate: 86400
    }
  });
  return response.data;
};

export const updateMotorGeneral = async (id: number, data: MotorGeneralFormData): Promise<Motor> => {
  const response = await fetchWithAuth<{ data: Motor }>(`/motorinci/motors/${id}`, {
    method: 'PUT', // Kita bisa gunakan PUT langsung jika API Anda mendukungnya untuk JSON
    body: JSON.stringify(data),
  });
  return response.data;
};

export const uploadMotorImage = async (motorId: number, imageData: FormData): Promise<MotorImage> => {
  // Kita tambahkan motor_id ke FormData di sini
  imageData.append('motor_id', String(motorId));
  const response = await fetchWithAuth<{ data: MotorImage }>('/motorinci/motor-images', {
    method: 'POST',
    body: imageData,
  });
  return response.data;
};

/**
 * UPDATE: Mengubah file gambar yang sudah ada.
 * Sesuai dengan kode backend yang Anda berikan.
 */
export const updateMotorImage = async (imageId: number, imageData: FormData): Promise<MotorImage> => {
  // Method spoofing untuk Laravel
  imageData.append('_method', 'PUT');
  const response = await fetchWithAuth<{ data: MotorImage }>(`/motorinci/motor-images/${imageId}`, {
    method: 'POST',
    body: imageData,
  });
  return response.data;
};

/**
 * DELETE: Menghapus sebuah gambar motor.
 * Asumsi endpoint: DELETE /api/motorinci/motor-images/{id}
 */
export const deleteMotorImage = async (imageId: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/motor-images/${imageId}`, {
    method: 'DELETE',
  });
};