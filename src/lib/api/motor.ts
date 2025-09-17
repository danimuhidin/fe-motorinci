// lib/api/motor.ts

import type { Motor } from '@/types/motor';
import type { Category } from '@/types/category';
import type { Brand } from '@/types/brand';
import { fetchWithAuth } from '../api';
interface CompareResponse {
  motor1: Motor;
  motor2: Motor;
}
export interface HomePageData {
  randomMotors: Motor[];
  categories: Category[];
  brands: Brand[];
}
/**
 * READ (All): Mengambil daftar semua motor dari server.
 */
export const getMotors = async (signal?: AbortSignal): Promise<Motor[]> => {
  const response = await fetchWithAuth<{ data: Motor[] }>('/motorinci/motors', { 
    signal, 
    method: 'GET' 
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
  const response = await fetchWithAuth<{ data: Motor[] }>(`/motorinci/motors?search=${encodeURIComponent(query)}&limit=10`, { // Limit 10 suggest
    signal, 
    method: 'GET' 
  });
  return response.data || response;
};

export const getRandomMotors = async (limit: number = 10, signal?: AbortSignal): Promise<Motor[]> => {
  const response = await fetchWithAuth<any>(`/motorinci/motors/random?limit=${limit}`, {
    signal,
    method: 'GET',
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
  const response = await fetchWithAuth<{ data: HomePageData }>('/motorinci/front/home', { 
    signal, 
    method: 'GET' 
  });
  return response.data;
};