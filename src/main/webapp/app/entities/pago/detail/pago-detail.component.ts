import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IPago } from '../pago.model';

@Component({
  selector: 'jhi-pago-detail',
  templateUrl: './pago-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class PagoDetailComponent {
  pago = input<IPago | null>(null);

  previousState(): void {
    window.history.back();
  }
}
