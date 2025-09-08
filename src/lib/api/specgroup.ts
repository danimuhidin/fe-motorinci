import type { Specgroup, NewSpecgroupData } from '@/types/specgroup';
import { fetchWithAuth } from '../api';

export const createSpecgroup = async (specgroupData: NewSpecgroupData): Promise<Specgroup> => {
  const response = await fetchWithAuth<{ data: Specgroup }>('/motorinci/specgroups', {
    method: 'POST',
    body: JSON.stringify(specgroupData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getSpecgroups = async (signal?: AbortSignal): Promise<Specgroup[]> => {
  const response = await fetchWithAuth<{ data: Specgroup[] }>('/motorinci/specgroups', {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const getSpecgroupById = async (id: number, signal?: AbortSignal): Promise<Specgroup> => {
  const response = await fetchWithAuth<{ data: Specgroup }>(`/motorinci/specgroups/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const updateSpecgroup = async (id: number, specgroupData: Partial<NewSpecgroupData>): Promise<Specgroup> => {
  const response = await fetchWithAuth<{ data: Specgroup }>(`/motorinci/specgroups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(specgroupData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteSpecgroup = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/specgroups/${id}`, {
    method: 'DELETE',
  });
};