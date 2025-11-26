import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

@Component({
  templateUrl: './reserva-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ReservaDeleteDialogComponent {
  reserva?: IReserva;

  protected reservaService = inject(ReservaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reservaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
