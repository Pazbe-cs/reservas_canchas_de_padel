import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface TarjetaResumen {
  titulo: string;
  valor: string;
  descripcion: string;
  color: 'success' | 'danger' | 'primary';
}

interface UsuarioCliente {
  id: number;
  nombre?: string;
  email?: string;
  telefono?: string;
}

interface ReservaApi {
  id: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  usuarioId?: number;
  canchaId?: number;

  // viene del backend (si pagó)
  pagoId?: number;

  usuarioNombre?: string;
  canchaNombre?: string;
}

interface ReservaTabla {
  id: number;
  fecha: string;
  cancha: string;
  horario: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
  cliente?: string;
  pagado: boolean;
}

@Component({
  standalone: true,
  selector: 'jhi-proceso-principal',
  templateUrl: './proceso-principal.component.html',
  styleUrls: ['./proceso-principal.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class ProcesoPrincipalComponent implements OnInit {
  constructor(private http: HttpClient) {}

  tarjetas: TarjetaResumen[] = [
    { titulo: 'Reservas de Hoy', valor: '0', descripcion: 'Total de reservas registradas hoy', color: 'success' },
    { titulo: 'Canchas Disponibles', valor: '-', descripcion: 'Canchas libres en este momento', color: 'primary' },
    { titulo: 'Ingresos del Día', valor: '-', descripcion: 'Monto estimado por reservas', color: 'danger' },
  ];

  usuarios: UsuarioCliente[] = [];
  reservasApi: ReservaApi[] = [];
  ultimasReservas: ReservaTabla[] = [];

  canchaIdSeleccionada: number | null = null;
  usuarioIdSeleccionado: number | null = null;

  fechaSeleccionada = new Date().toISOString().slice(0, 10);
  horaInicioSeleccionada = '18:00';
  horaFinSeleccionada = '19:00';

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarReservas();
  }

  private cargarUsuarios(): void {
    this.http.get<UsuarioCliente[]>('/api/usuarios').subscribe({
      next: data => {
        this.usuarios = data ?? [];
        if (!this.usuarioIdSeleccionado && this.usuarios.length > 0) {
          this.usuarioIdSeleccionado = this.usuarios[0].id;
        }
        this.mapearReservasATabla();
      },
      error: err => {
        console.error('Error cargando usuarios', err);
      },
    });
  }

  // ✅ AHORA ES PÚBLICO
  cargarReservas(): void {
    this.http.get<ReservaApi[]>('/api/reservas-proceso').subscribe({
      next: data => {
        this.reservasApi = data ?? [];
        this.mapearReservasATabla();
        this.actualizarTarjetas();
      },
      error: err => {
        console.error('Error cargando reservas', err);
        alert('No se pudo cargar el listado de reservas.');
      },
    });
  }

  private mapearReservasATabla(): void {
    const mapUsuarios = new Map<number, UsuarioCliente>();
    for (const u of this.usuarios) mapUsuarios.set(u.id, u);

    this.ultimasReservas = (this.reservasApi ?? [])
      .slice()
      .reverse()
      .slice(0, 10)
      .map(r => {
        const cliente =
          r.usuarioNombre ||
          (r.usuarioId ? (mapUsuarios.get(r.usuarioId)?.nombre ?? `Usuario #${r.usuarioId}`) : 'Sin cliente');

        const cancha = r.canchaNombre || (r.canchaId ? `Cancha #${r.canchaId}` : 'Sin cancha');

        const fecha = r.fecha ? this.formatearFecha(r.fecha) : '-';
        const horario = `${r.horaInicio ?? '--:--'} - ${r.horaFin ?? '--:--'}`;

        const pagado = !!r.pagoId;
        const estado: ReservaTabla['estado'] = pagado ? 'Confirmada' : 'Pendiente';

        return { id: r.id, fecha, cancha, horario, estado, cliente, pagado };
      });
  }

  private actualizarTarjetas(): void {
    const hoy = new Date().toISOString().slice(0, 10);
    const reservasHoy = this.reservasApi.filter(r => r.fecha === hoy).length;

    this.tarjetas = this.tarjetas.map(t => {
      if (t.titulo === 'Reservas de Hoy') return { ...t, valor: String(reservasHoy) };
      return t;
    });
  }

  private formatearFecha(yyyyMmDd: string): string {
    const [y, m, d] = yyyyMmDd.split('-');
    if (!y || !m || !d) return yyyyMmDd;
    return `${d}/${m}/${y}`;
  }

  abrirPago(r: ReservaTabla): void {
    if (r.pagado) return;

    const montoStr = prompt('Monto a cobrar (solo números):', '150000');
    if (!montoStr) return;

    const monto = Number(montoStr);
    if (Number.isNaN(monto) || monto <= 0) {
      alert('Monto inválido');
      return;
    }

    this.pagarReserva(r.id, monto);
  }

  private pagarReserva(reservaId: number, monto: number): void {
    this.http.put(`/api/reservas-proceso/${reservaId}/pagar`, { monto }).subscribe({
      next: () => {
        alert('Pago registrado ✅');
        this.cargarReservas();
      },
      error: err => {
        console.error('Error pagando reserva', err);
        alert('No se pudo registrar el pago.');
      },
    });
  }

  registrarReserva(): void {
    if (!this.usuarioIdSeleccionado) {
      alert('Seleccioná un cliente.');
      return;
    }
    if (!this.canchaIdSeleccionada) {
      alert('Seleccioná una cancha.');
      return;
    }

    const body = {
      usuarioId: this.usuarioIdSeleccionado,
      canchaId: this.canchaIdSeleccionada,
      fecha: this.fechaSeleccionada,
      horaInicio: this.horaInicioSeleccionada,
      horaFin: this.horaFinSeleccionada,
    };

    this.http.post<boolean>('/api/reservas-proceso/validar', body).subscribe({
      next: disponible => {
        if (!disponible) {
          alert('La cancha ya está reservada en ese horario.');
          return;
        }

        this.http.post('/api/reservas-proceso', body).subscribe({
          next: () => {
            alert('Reserva registrada correctamente ✅');
            this.cargarReservas();
          },
          error: err => {
            console.error('Error registrando reserva', err);
            alert('No se pudo registrar la reserva.');
          },
        });
      },
      error: () => {
        this.http.post('/api/reservas-proceso', body).subscribe({
          next: () => {
            alert('Reserva registrada correctamente ✅');
            this.cargarReservas();
          },
          error: err => {
            console.error('Error registrando reserva', err);
            alert('No se pudo registrar la reserva.');
          },
        });
      },
    });
  }
}
