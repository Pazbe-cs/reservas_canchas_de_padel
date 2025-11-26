export interface IUsuario {
  id: number;
  nombre?: string | null;
  email?: string | null;
  telefono?: string | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
