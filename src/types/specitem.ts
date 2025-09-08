export interface Specitem {
  id: number;
  specification_group_id: number;
  name: string;
  unit: string;
  desc?: string;
  order: number;
}
export type NewSpecitemData = Omit<Specitem, 'id'>;