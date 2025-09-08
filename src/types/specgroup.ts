export interface Specgroup {
  id: number;
  name: string;
  order: number;
}
export type NewSpecgroupData = Omit<Specgroup, 'id'>;