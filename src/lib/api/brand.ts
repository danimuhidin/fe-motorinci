import type { Brand, NewBrandData } from '@/types/brand';
import { fetchWithAuth } from '../api';

export type BrandFormData = Omit<NewBrandData, 'icon' | 'image'> & {
  icon?: File;
  image?: File;
};

export const createBrand = async (brandData: BrandFormData): Promise<Brand> => {
  const hasFiles = brandData.icon || brandData.image;

  let body: FormData | string;
  const headers: HeadersInit = {};

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
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetchWithAuth<{ data: Brand }>('/motorinci/brands', {
    method: 'POST',
    headers,
    body,
  });
  return response.data;
};

export const getBrands = async (signal?: AbortSignal): Promise<Brand[]> => {
  const response = await fetchWithAuth<{ data: Brand[] }>('/motorinci/brands', { 
    signal, 
    method: 'GET',
    next: {
      revalidate: 86400
    }
  });
  return response.data;
};

export const getBrandById = async (id: number, signal?: AbortSignal): Promise<Brand> => {
  const response = await fetchWithAuth<{ data: Brand }>(`/motorinci/brands/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const updateBrand = async (id: number, brandData: Partial<BrandFormData>): Promise<Brand> => {
  const formData = new FormData();
  
  if (brandData.name) formData.append('name', brandData.name);
  if (brandData.desc) formData.append('desc', brandData.desc);
  if (brandData.icon) formData.append('icon', brandData.icon);
  if (brandData.image) formData.append('image', brandData.image);
  
  formData.append('_method', 'PUT'); 

  const response = await fetchWithAuth<{ data: Brand }>(`/motorinci/brands/${id}`, {
    method: 'POST',
    body: formData,
  });
  return response.data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/brands/${id}`, {
    method: 'DELETE',
  });
};