import { apiFetch } from "../core"; // <-- Impor "mesin"-nya

// Definisikan tipe data untuk brand
export interface Brand {
  id: number;
  name: string;
  desc?: string;
  icon?: string;
  image?: string;
}

export type NewBrandData = Omit<Brand, 'id'>;

// Fungsi getBrands sekarang jadi sangat ringkas!
export const getBrands = async (): Promise<Brand[]> => {
  try {
    const data = await apiFetch('/motorinci/brands', {
      method: 'GET'
    });
    // Sesuaikan 'data.data' jika API Anda membungkus hasil dalam properti 'data'
    return data.data || data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return []; // Kembalikan array kosong jika gagal
  }
};

// Contoh fungsi lain untuk mengambil satu brand berdasarkan ID
export const getBrandById = async (id: string): Promise<Brand | null> => {
   try {
    const data = await apiFetch(`/motorinci/brands/${id}`, {
      method: 'GET'
    });
    return data.data || data;
  } catch (error) {
    console.error(`Failed to fetch brand with id ${id}:`, error);
    return null;
  }
}

export const createBrand = async (brandData: NewBrandData): Promise<Brand> => {
  const newBrand = await apiFetch('/motorinci/brands', {
    method: 'POST',
    body: JSON.stringify(brandData),
  });
  return newBrand.data || newBrand;
};