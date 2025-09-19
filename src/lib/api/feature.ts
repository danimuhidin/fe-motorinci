import type { Feature, NewFeatureData } from '@/types/feature';
import { fetchWithAuth } from '../api';

export type FeatureFormData = Omit<NewFeatureData, 'icon'> & {
  icon?: File;
};

export const createFeature = async (featureData: FeatureFormData): Promise<Feature> => {
  const hasFiles = featureData.icon;
  let body: FormData | string;
  const headers: HeadersInit = {};
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

  const response = await fetchWithAuth<{ data: Feature }>('/motorinci/features', {
    method: 'POST',
    headers,
    body,
  });
  return response.data;
};

export const getFeatures = async (signal?: AbortSignal): Promise<Feature[]> => {
  const response = await fetchWithAuth<{ data: Feature[] }>('/motorinci/features', {
    signal,
    method: 'GET',
    next: {
      revalidate: 86400
    }
  });
  return response.data;
};

export const getFeatureById = async (id: number, signal?: AbortSignal): Promise<Feature> => {
  const response = await fetchWithAuth<{ data: Feature }>(`/motorinci/features/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const updateFeature = async (id: number, featureData: Partial<FeatureFormData>): Promise<Feature> => {
  const formData = new FormData();

  if (featureData.name) formData.append('name', featureData.name);
  if (featureData.desc) formData.append('desc', featureData.desc);
  if (featureData.icon) formData.append('icon', featureData.icon);

  formData.append('_method', 'PUT');

  const response = await fetchWithAuth<{ data: Feature }>(`/motorinci/features/${id}`, {
    method: 'POST',
    body: formData,
  });
  return response.data;
};

export const deleteFeature = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/features/${id}`, {
    method: 'DELETE',
  });
};