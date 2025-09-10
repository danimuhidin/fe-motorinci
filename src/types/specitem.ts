export interface Specitem {
  id: number;
  specification_group_id: number | null;
  specification_group: { id: number; name: string; };
  name: string;
  unit: string;
  desc?: string;
}
export type NewSpecitemData = Omit<Specitem, 'id'>;