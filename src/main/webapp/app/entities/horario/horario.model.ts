import { ICancha } from 'app/entities/cancha/cancha.model';

export interface IHorario {
  id: number;
  dia?: string | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  cancha?: ICancha | null;
}

export type NewHorario = Omit<IHorario, 'id'> & { id: null };
