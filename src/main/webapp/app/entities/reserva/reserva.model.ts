import dayjs from 'dayjs/esm';
import { IPago } from 'app/entities/pago/pago.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { ICancha } from 'app/entities/cancha/cancha.model';

export interface IReserva {
  id: number;
  fecha?: dayjs.Dayjs | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  pago?: IPago | null;
  usuario?: IUsuario | null;
  cancha?: ICancha | null;
}

export type NewReserva = Omit<IReserva, 'id'> & { id: null };
