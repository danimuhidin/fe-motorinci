export interface Category {
  id: number;
  name: string;
  desc?: string;
  image?: string | null;
}
export type NewCategoryData = Omit<Category, 'id'>;