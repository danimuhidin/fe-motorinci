// lib/api/specification.ts

import { fetchWithAuth } from '../api';
import type { SpecificationItem } from '@/types/specification';
import type { Specification } from '@/types/motor';

/**
 * Mengambil daftar semua item spesifikasi yang tersedia (master data).
 */
export const getSpecificationItems = async (signal?: AbortSignal): Promise<SpecificationItem[]> => {
  const response = await fetchWithAuth<{ data: SpecificationItem[] }>('/motorinci/specification-items', { 
    signal, 
    method: 'GET' 
  });
  return response.data;
};

/**
 * CREATE: Membuat relasi spesifikasi baru untuk motor.
 * Endpoint: POST /motorinci/motor-specifications
 */
export const createMotorSpecification = async (
  motorId: number, 
  specItemId: number, 
  value: string
): Promise<Specification> => {
  const response = await fetchWithAuth<{ data: Specification }>('/motorinci/motor-specifications', {
    method: 'POST',
    body: JSON.stringify({
      motor_id: motorId,
      specification_item_id: specItemId,
      value: value,
    }),
  });
  return response.data;
};

/**
 * UPDATE: Mengupdate nilai spesifikasi motor yang sudah ada.
 * Endpoint: PUT /motorinci/motor-specifications/{id}
 */
export const updateMotorSpecification = async (
  motorSpecId: number,
  motorId: number,
  specItemId: number,
  value: string
): Promise<Specification> => {
  const response = await fetchWithAuth<{ data: Specification }>(`/motorinci/motor-specifications/${motorSpecId}`, {
    method: 'PUT',
    body: JSON.stringify({
      motor_id: motorId,
      specification_item_id: specItemId,
      value: value,
    }),
  });
  return response.data;
};

/**
 * Menghapus nilai spesifikasi dari motor.
 */
export const removeMotorSpecification = async (motorSpecId: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/motor-specifications/${motorSpecId}`, {
    method: 'DELETE',
  });
};