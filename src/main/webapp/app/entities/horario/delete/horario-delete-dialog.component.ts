import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IHorario } from '../horario.model';
import { HorarioService } from '../service/horario.service';

@Component({
  templateUrl: './horario-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class HorarioDeleteDialogComponent {
  horario?: IHorario;

  protected horarioService = inject(HorarioService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.horarioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
