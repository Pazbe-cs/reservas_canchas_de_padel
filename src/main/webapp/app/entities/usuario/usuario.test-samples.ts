import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 23732,
  nombre: 'though phew',
  email: 'Maximus_Mueller96@hotmail.com',
};

export const sampleWithPartialData: IUsuario = {
  id: 1812,
  nombre: 'usher within',
  email: 'Antonetta31@gmail.com',
};

export const sampleWithFullData: IUsuario = {
  id: 32608,
  nombre: 'outlaw lest',
  email: 'Ruthie.Farrell@hotmail.com',
  telefono: 'yum up',
};

export const sampleWithNewData: NewUsuario = {
  nombre: 'beside pish strait',
  email: 'Jerrold69@yahoo.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
