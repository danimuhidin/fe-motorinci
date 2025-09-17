
import type { Motor } from './motor'; // Impor tipe Motor

export interface Brand {
  id: number;
  name: string;
  desc?: string;
  icon?: string | null;
  image?: string | null;
  motors?: Motor[];
}
export type NewBrandData = Omit<Brand, 'id'>;