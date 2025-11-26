import { IHorario, NewHorario } from './horario.model';

export const sampleWithRequiredData: IHorario = {
  id: 12815,
  dia: 'unless showy briefly',
  horaInicio: '19:30:00',
  horaFin: '16:08:00',
};

export const sampleWithPartialData: IHorario = {
  id: 31117,
  dia: 'gee scruple naturally',
  horaInicio: '06:26:00',
  horaFin: '20:19:00',
};

export const sampleWithFullData: IHorario = {
  id: 3371,
  dia: 'till',
  horaInicio: '03:03:00',
  horaFin: '13:59:00',
};

export const sampleWithNewData: NewHorario = {
  dia: 'lost',
  horaInicio: '04:31:00',
  horaFin: '00:31:00',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
