import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICancha } from '../cancha.model';
import { CanchaService } from '../service/cancha.service';

@Component({
  templateUrl: './cancha-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CanchaDeleteDialogComponent {
  cancha?: ICancha;

  protected canchaService = inject(CanchaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.canchaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
