export interface Feature {
  id: number;
  name: string;
  desc?: string;
  icon?: string | null;
}
export type NewFeatureData = Omit<Feature, 'id'>;