import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IUsuario } from '../usuario.model';

@Component({
  selector: 'jhi-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class UsuarioDetailComponent {
  usuario = input<IUsuario | null>(null);

  previousState(): void {
    window.history.back();
  }
}
