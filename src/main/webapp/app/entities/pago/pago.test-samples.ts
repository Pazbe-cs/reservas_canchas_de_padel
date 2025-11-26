import dayjs from 'dayjs/esm';

import { IPago, NewPago } from './pago.model';

export const sampleWithRequiredData: IPago = {
  id: 23658,
  fecha: dayjs('2025-11-24T08:05'),
  monto: 25104.7,
};

export const sampleWithPartialData: IPago = {
  id: 9272,
  fecha: dayjs('2025-11-24T17:41'),
  monto: 22382.89,
};

export const sampleWithFullData: IPago = {
  id: 9975,
  fecha: dayjs('2025-11-24T13:04'),
  monto: 10466.1,
};

export const sampleWithNewData: NewPago = {
  fecha: dayjs('2025-11-23T23:55'),
  monto: 18242.35,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
