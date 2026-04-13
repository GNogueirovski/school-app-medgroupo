import { Shift } from '../schools/types';

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  shift: Shift;
  academicYear: number;
}
