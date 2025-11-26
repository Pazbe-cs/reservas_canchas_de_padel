import { ICancha, NewCancha } from './cancha.model';

export const sampleWithRequiredData: ICancha = {
  id: 10630,
  nombre: 'dapper advertisement',
  precio: 20184.1,
};

export const sampleWithPartialData: ICancha = {
  id: 28837,
  nombre: 'deform',
  precio: 12495.12,
};

export const sampleWithFullData: ICancha = {
  id: 27337,
  nombre: 'calmly till',
  tipo: 'suddenly well',
  precio: 12102.68,
};

export const sampleWithNewData: NewCancha = {
  nombre: 'lest below',
  precio: 30970.79,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
