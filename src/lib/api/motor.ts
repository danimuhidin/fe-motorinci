// lib/api/motor.ts

import type { Motor } from '@/types/motor';
import { fetchWithAuth } from '../api';

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