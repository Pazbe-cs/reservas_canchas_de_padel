import dayjs from 'dayjs/esm';

export interface IPago {
  id: number;
  fecha?: dayjs.Dayjs | null;
  monto?: number | null;
}

export type NewPago = Omit<IPago, 'id'> & { id: null };
