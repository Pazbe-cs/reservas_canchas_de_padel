import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-volver-inicio',
  standalone: true,
  templateUrl: './volver-inicio.component.html',
  styleUrls: ['./volver-inicio.component.scss'],
  imports: [CommonModule],
})
export class VolverInicioComponent {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
