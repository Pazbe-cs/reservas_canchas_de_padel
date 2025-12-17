import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioCliente {
  id: number;
  nombre?: string;
  email?: string;
  telefono?: string;
}

export interface ReservaApi {
  id: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  usuarioId?: number;
  canchaId?: number;
  usuarioNombre?: string;
  canchaNombre?: string;
}

export interface ReservaCrearRequest {
  usuarioId: number;
  canchaId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

@Injectable({ providedIn: 'root' })
export class ProcesoReservaApiService {
  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<UsuarioCliente[]> {
    return this.http.get<UsuarioCliente[]>('/api/usuarios');
  }

  listarReservas(): Observable<ReservaApi[]> {
    return this.http.get<ReservaApi[]>('/api/reservas-proceso');
  }

  validarDisponibilidad(payload: ReservaCrearRequest): Observable<boolean> {
    return this.http.post<boolean>('/api/reservas-proceso/validar', payload);
  }

  crearReserva(payload: ReservaCrearRequest): Observable<any> {
    return this.http.post('/api/reservas-proceso', payload);
  }
}
