import type { Motor } from './motor';
export interface Category {
  id: number;
  name: string;
  desc?: string;
  image?: string | null; 
  motors?: Motor[];
}
export type NewCategoryData = Omit<Category, 'id'>;