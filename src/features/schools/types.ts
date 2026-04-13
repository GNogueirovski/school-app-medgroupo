export enum Shift {
  Morning = 'Matutino',
  Afternoon = 'Vespertino',
  Evening = 'Noturno',
}

export interface School {
  id: string;
  name: string;
  address: string;
  classCount: number;
  shifts: Shift[];
}
