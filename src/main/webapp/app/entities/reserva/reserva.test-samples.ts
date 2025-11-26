import dayjs from 'dayjs/esm';

import { IReserva, NewReserva } from './reserva.model';

export const sampleWithRequiredData: IReserva = {
  id: 22571,
  fecha: dayjs('2025-11-24'),
  horaInicio: '05:12:00',
  horaFin: '16:21:00',
};

export const sampleWithPartialData: IReserva = {
  id: 7546,
  fecha: dayjs('2025-11-24'),
  horaInicio: '23:53:00',
  horaFin: '00:12:00',
};

export const sampleWithFullData: IReserva = {
  id: 8504,
  fecha: dayjs('2025-11-24'),
  horaInicio: '06:02:00',
  horaFin: '06:57:00',
};

export const sampleWithNewData: NewReserva = {
  fecha: dayjs('2025-11-24'),
  horaInicio: '07:48:00',
  horaFin: '22:01:00',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
