// lib/api/feature.ts

// 1. Beri nama alias pada tipe yang diimpor untuk menghindari konflik
import type { 
  Feature as FeatureItem, // 'Feature' dari feature.ts (master) kita sebut 'FeatureItem'
  NewFeatureData as NewFeatureItemData 
} from '@/types/feature';
import type { Feature as MotorFeatureRel } from '@/types/motor'; // 'Feature' dari motor.ts (relasi) kita sebut 'MotorFeatureRel'
import { fetchWithAuth } from '../api';

// Tipe FormData sekarang menggunakan alias yang jelas
export type FeatureItemFormData = Omit<NewFeatureItemData, 'icon'> & {
  icon?: File;
};


// =============================================================
// FUNGSI UNTUK MENGELOLA MASTER DATA FITUR (Feature Items)
// (Kode Anda yang sudah ada, disesuaikan tipenya)
// =============================================================

export const createFeatureItem = async (featureData: FeatureItemFormData): Promise<FeatureItem> => {
  const hasFiles = featureData.icon;
  let body: FormData | string;
  const headers: Record<string, string> = {}; // Perbaikan dari error sebelumnya
  if (hasFiles) {
    const formData = new FormData();
    formData.append('name', featureData.name);
    if (featureData.desc) formData.append('desc', featureData.desc);
    if (featureData.icon) formData.append('icon', featureData.icon);
    body = formData;
  } else {
    body = JSON.stringify({
      name: featureData.name,
      desc: featureData.desc,
    });
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetchWithAuth<{ data: FeatureItem }>('/motorinci/features', {
    method: 'POST',
    headers,
    body,
  });
  return response.data;
};

// Nama fungsi diubah agar lebih jelas (get all Feature Items)
export const getFeatureItems = async (signal?: AbortSignal): Promise<FeatureItem[]> => {
  const response = await fetchWithAuth<{ data: FeatureItem[] }>('/motorinci/features', {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const getFeatureItemById = async (id: number, signal?: AbortSignal): Promise<FeatureItem> => {
  const response = await fetchWithAuth<{ data: FeatureItem }>(`/motorinci/features/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const updateFeatureItem = async (id: number, featureData: Partial<FeatureItemFormData>): Promise<FeatureItem> => {
  const formData = new FormData();
  if (featureData.name) formData.append('name', featureData.name);
  if (featureData.desc) formData.append('desc', featureData.desc);
  if (featureData.icon) formData.append('icon', featureData.icon);
  formData.append('_method', 'PUT');

  const response = await fetchWithAuth<{ data: FeatureItem }>(`/motorinci/features/${id}`, {
    method: 'POST',
    body: formData,
  });
  return response.data;
};

export const deleteFeatureItem = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/features/${id}`, {
    method: 'DELETE',
  });
};


// ====================================================================
// FUNGSI BARU UNTUK MENGELOLA RELASI ANTARA MOTOR DAN FITUR
// ====================================================================

/**
 * Menambahkan relasi fitur ke sebuah motor.
 */
export const addMotorFeature = async (motorId: number, featureItemId: number): Promise<MotorFeatureRel> => {
  const response = await fetchWithAuth<{ data: MotorFeatureRel }>('/motorinci/motor-features', {
    method: 'POST',
    body: JSON.stringify({
      motor_id: motorId,
      feature_item_id: featureItemId,
    }),
  });
  return response.data;
};

/**
 * Menghapus relasi fitur dari sebuah motor.
 */
export const removeMotorFeature = async (motorFeatureId: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/motor-features/${motorFeatureId}`, {
    method: 'DELETE',
  });
};