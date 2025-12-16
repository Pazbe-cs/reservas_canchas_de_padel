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
  fecha?: string;       // "2025-12-16"
  horaInicio?: string;  // "18:00"
  horaFin?: string;     // "19:00"
  usuarioId?: number;
  canchaId?: number;

  // si después agregás estos en tu DTO, se llenan solos:
  usuarioNombre?: string;
  canchaNombre?: string;
}

interface ReservaTabla {
  fecha: string;
  cancha: string;
  horario: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
  cliente?: string;
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

  // Datos reales
  usuarios: UsuarioCliente[] = [];
  reservasApi: ReservaApi[] = [];

  // Tabla de UI
  ultimasReservas: ReservaTabla[] = [];

  // Form
  canchaIdSeleccionada: number | null = null;
  usuarioIdSeleccionado: number | null = null;

  fechaSeleccionada = new Date().toISOString().slice(0, 10); // yyyy-MM-dd
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
      },
      error: err => {
        console.error('Error cargando usuarios', err);
        alert('No se pudo cargar el listado de clientes (usuarios). Revisá el token/roles.');
      },
    });
  }

  private cargarReservas(): void {
    this.http.get<ReservaApi[]>('/api/reservas-proceso').subscribe({
      next: data => {
        this.reservasApi = data ?? [];
        this.mapearReservasATabla();
        this.actualizarTarjetas();
      },
      error: err => {
        console.error('Error cargando reservas', err);
        alert('No se pudo cargar el listado de reservas. Revisá el token/roles.');
      },
    });
  }

  private mapearReservasATabla(): void {
    // armamos un mapa de usuarios para mostrar nombre en la tabla aunque el backend devuelva solo usuarioId
    const mapUsuarios = new Map<number, UsuarioCliente>();
    for (const u of this.usuarios) mapUsuarios.set(u.id, u);

    this.ultimasReservas = (this.reservasApi ?? [])
      .slice()
      .reverse() // para ver las últimas al final como nuevas arriba (ajustá si querés)
      .slice(0, 10)
      .map(r => {
        const cliente =
          r.usuarioNombre ||
          (r.usuarioId ? (mapUsuarios.get(r.usuarioId)?.nombre ?? `Usuario #${r.usuarioId}`) : 'Sin cliente');

        const cancha = r.canchaNombre || (r.canchaId ? `Cancha #${r.canchaId}` : 'Sin cancha');

        const fecha = r.fecha ? this.formatearFecha(r.fecha) : '-';
        const horario = `${r.horaInicio ?? '--:--'} - ${r.horaFin ?? '--:--'}`;

        // como tu backend no maneja estado real todavía, lo dejamos como Pendiente por defecto
        const estado: ReservaTabla['estado'] = 'Pendiente';

        return { fecha, cancha, horario, estado, cliente };
      });
  }

  private actualizarTarjetas(): void {
    const hoy = new Date().toISOString().slice(0, 10); // yyyy-MM-dd
    const reservasHoy = this.reservasApi.filter(r => r.fecha === hoy).length;

    this.tarjetas = this.tarjetas.map(t => {
      if (t.titulo === 'Reservas de Hoy') return { ...t, valor: String(reservasHoy) };
      return t;
    });
  }

  private formatearFecha(yyyyMmDd: string): string {
    // "2025-12-16" -> "16/12/2025"
    const [y, m, d] = yyyyMmDd.split('-');
    if (!y || !m || !d) return yyyyMmDd;
    return `${d}/${m}/${y}`;
  }

  registrarReserva(): void {
    if (!this.usuarioIdSeleccionado) {
      alert('Seleccioná un cliente (Usuario) del listado.');
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

    // 1) validar disponibilidad (si tenés el endpoint)
    this.http.post<boolean>('/api/reservas-proceso/validar', body).subscribe({
      next: disponible => {
        if (!disponible) {
          alert('La cancha ya está reservada en ese horario.');
          return;
        }

        // 2) registrar reserva real
        this.http.post('/api/reservas-proceso', body).subscribe({
          next: () => {
            alert('Reserva registrada correctamente ✅');
            this.cargarReservas();
          },
          error: err => {
            console.error('Error registrando reserva', err);
            alert('No se pudo registrar la reserva. Revisá el backend / token / datos.');
          },
        });
      },
      error: () => {
        // si tu endpoint validar no existe todavía, al menos registramos directo
        this.http.post('/api/reservas-proceso', body).subscribe({
          next: () => {
            alert('Reserva registrada correctamente ✅');
            this.cargarReservas();
          },
          error: err => {
            console.error('Error registrando reserva', err);
            alert('No se pudo registrar la reserva. Revisá el backend / token / datos.');
          },
        });
      },
    });
  }
}
