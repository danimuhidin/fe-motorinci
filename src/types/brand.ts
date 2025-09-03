
export interface Brand {
  id: number;
  name: string;
  desc?: string;
  icon?: string | null;
  image?: string | null;
}
export type NewBrandData = Omit<Brand, 'id'>;