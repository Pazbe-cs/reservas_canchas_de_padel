import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ICancha } from '../cancha.model';

@Component({
  selector: 'jhi-cancha-detail',
  templateUrl: './cancha-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class CanchaDetailComponent {
  cancha = input<ICancha | null>(null);

  previousState(): void {
    window.history.back();
  }
}
