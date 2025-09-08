import type { Color, NewColorData } from '@/types/color';
import { fetchWithAuth } from '../api';

export const createColor = async (colorData: NewColorData): Promise<Color> => {
  const response = await fetchWithAuth<{ data: Color }>('/motorinci/colors', {
    method: 'POST',
    body: JSON.stringify(colorData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getColors = async (signal?: AbortSignal): Promise<Color[]> => {
  const response = await fetchWithAuth<{ data: Color[] }>('/motorinci/colors', { 
    signal,
    method: 'GET',
  });
  return response.data;
};

export const getColorById = async (id: number, signal?: AbortSignal): Promise<Color> => {
  const response = await fetchWithAuth<{ data: Color }>(`/motorinci/colors/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};


export const updateColor = async (id: number, colorData: Partial<NewColorData>): Promise<Color> => {
  const response = await fetchWithAuth<{ data: Color }>(`/motorinci/colors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(colorData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};


export const deleteColor = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/colors/${id}`, {
    method: 'DELETE',
  });
};