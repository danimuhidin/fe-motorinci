import type { Category, NewCategoryData } from '@/types/category';
import { fetchWithAuth } from '../api';

export type CategoryFormData = Omit<NewCategoryData, 'image'> & {
  image?: File;
};

export const createCategory = async (categoryData: CategoryFormData): Promise<Category> => {
  const hasFiles = categoryData.image;

  let body: FormData | string;
  const headers: HeadersInit = {};

  if (hasFiles) {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    if (categoryData.desc) formData.append('desc', categoryData.desc);
    if (categoryData.image) formData.append('image', categoryData.image);
    body = formData;
  } else {
    body = JSON.stringify({
      name: categoryData.name,
      desc: categoryData.desc,
    });
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetchWithAuth<{ data: Category }>('/motorinci/categories', {
    method: 'POST',
    headers,
    body,
  });
  return response.data;
};

export const getCategories = async (signal?: AbortSignal): Promise<Category[]> => {
  const response = await fetchWithAuth<{ data: Category[] }>('/motorinci/categories', { 
    signal,
    method: 'GET',
    next: {
      revalidate: 86400
    }
  });
  return response.data;
};

export const getCategoryById = async (id: number, signal?: AbortSignal): Promise<Category> => {
  const response = await fetchWithAuth<{ data: Category }>(`/motorinci/categories/${id}`, {
    signal,
    method: 'GET',
  });
  return response.data;
};

export const updateCategory = async (id: number, categoryData: Partial<CategoryFormData>): Promise<Category> => {
  const formData = new FormData();

  if (categoryData.name) formData.append('name', categoryData.name);
  if (categoryData.desc) formData.append('desc', categoryData.desc);
  if (categoryData.image) formData.append('image', categoryData.image);

  formData.append('_method', 'PUT');

  const response = await fetchWithAuth<{ data: Category }>(`/motorinci/categories/${id}`, {
    method: 'POST',
    body: formData,
  });
  return response.data;
};


export const deleteCategory = async (id: number): Promise<void> => {
  await fetchWithAuth<void>(`/motorinci/categories/${id}`, {
    method: 'DELETE',
  });
};