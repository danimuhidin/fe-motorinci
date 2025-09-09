import type { Specitem, NewSpecitemData } from '@/types/specitem';
import { fetchWithAuth } from '../api';

export const createSpecitem = async (specitemData: NewSpecitemData): Promise<Specitem> => {
  const response = await fetchWithAuth<{ data: Specitem }>('/motorinci/specification-items', {
    method: 'POST',
    body: JSON.stringify(specitemData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getSpecitems = async (signal?: AbortSignal): Promise<Specitem[]> => {
  const response = await fetchWithAuth<{ data: Specitem[] }>('/motorinci/specification-items', { 
    signal,
    method: 'GET',
  });
  return response.data;
};

export const getSpecitemById = async (id: number, signal?: AbortSignal): Promise<Specitem> => {
  const response = await fetchWithAuth<{ data: Specitem }>(`/motorinci/specification-items/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const updateSpecitem = async (id: number, specitemData: Partial<NewSpecitemData>): Promise<Specitem> => {
  const response = await fetchWithAuth<{ data: Specitem }>(`/motorinci/specification-items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(specitemData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteSpecitem = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/specification-items/${id}`, {
    method: 'DELETE',
  });
};