export interface Color {
  id: number;
  name: string;
  hex: string;
}
export type NewColorData = Omit<Color, 'id'>;