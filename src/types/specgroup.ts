export interface Specgroup {
  id: number;
  name: string;
}
export type NewSpecgroupData = Omit<Specgroup, 'id'>;