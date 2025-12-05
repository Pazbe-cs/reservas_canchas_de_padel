import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TarjetaResumen {
  titulo: string;
  valor: string;
  descripcion: string;
  color: 'success' | 'danger' | 'primary';
}

interface ReservaTabla {
  fecha: string;
  cancha: string;
  horario: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Component({
  standalone: true,
  selector: 'jhi-proceso-principal',
  templateUrl: './proceso-principal.component.html',
  styleUrls: ['./proceso-principal.component.scss'],
  imports: [CommonModule, FormsModule], // 🔥 IMPORTANTE: agrega todo lo que te faltaba
})
export class ProcesoPrincipalComponent {
  tarjetas: TarjetaResumen[] = [
    { titulo: 'Reservas de Hoy', valor: '12', descripcion: 'Total de reservas registradas hoy', color: 'success' },
    { titulo: 'Canchas Disponibles', valor: '4', descripcion: 'Canchas libres en este momento', color: 'primary' },
    { titulo: 'Ingresos del Día', valor: 'Gs. 850.000', descripcion: 'Monto estimado por reservas', color: 'danger' },
  ];

  ultimasReservas: ReservaTabla[] = [
    { fecha: '04/12/2025', cancha: 'Cancha 1', horario: '18:00 - 19:00', estado: 'Confirmada' },
    { fecha: '04/12/2025', cancha: 'Cancha 2', horario: '19:00 - 20:00', estado: 'Pendiente' },
    { fecha: '03/12/2025', cancha: 'Cancha 3', horario: '17:00 - 18:00', estado: 'Confirmada' },
    { fecha: '03/12/2025', cancha: 'Cancha 1', horario: '20:00 - 21:00', estado: 'Cancelada' },
  ];

  tipoReserva = 'Amistoso';
  canchaSeleccionada = 'Cancha 1';
  horarioSeleccionado = '18:00 - 19:00';
  nombreCliente = '';
  telefonoCliente = '';

  registrarReserva(): void {
    this.ultimasReservas.unshift({
      fecha: new Date().toLocaleDateString(),
      cancha: this.canchaSeleccionada,
      horario: this.horarioSeleccionado,
      estado: 'Pendiente',
    });

    alert('Reserva registrada (simulada). Más adelante se conectará al backend.');
  }
}
