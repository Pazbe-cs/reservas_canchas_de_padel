export interface ICancha {
  id: number;
  nombre?: string | null;
  tipo?: string | null;
  precio?: number | null;
}

export type NewCancha = Omit<ICancha, 'id'> & { id: null };
