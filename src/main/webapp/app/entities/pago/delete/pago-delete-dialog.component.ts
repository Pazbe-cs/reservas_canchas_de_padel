import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPago } from '../pago.model';
import { PagoService } from '../service/pago.service';

@Component({
  templateUrl: './pago-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PagoDeleteDialogComponent {
  pago?: IPago;

  protected pagoService = inject(PagoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pagoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
