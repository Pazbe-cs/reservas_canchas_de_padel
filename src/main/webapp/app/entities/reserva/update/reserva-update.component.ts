import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPago } from 'app/entities/pago/pago.model';
import { PagoService } from 'app/entities/pago/service/pago.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { ReservaService } from '../service/reserva.service';
import { IReserva } from '../reserva.model';
import { ReservaFormGroup, ReservaFormService } from './reserva-form.service';

@Component({
  selector: 'jhi-reserva-update',
  templateUrl: './reserva-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReservaUpdateComponent implements OnInit {
  isSaving = false;
  reserva: IReserva | null = null;

  pagosCollection: IPago[] = [];
  usuariosSharedCollection: IUsuario[] = [];
  canchasSharedCollection: ICancha[] = [];

  protected reservaService = inject(ReservaService);
  protected reservaFormService = inject(ReservaFormService);
  protected pagoService = inject(PagoService);
  protected usuarioService = inject(UsuarioService);
  protected canchaService = inject(CanchaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ReservaFormGroup = this.reservaFormService.createReservaFormGroup();

  comparePago = (o1: IPago | null, o2: IPago | null): boolean => this.pagoService.comparePago(o1, o2);

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  compareCancha = (o1: ICancha | null, o2: ICancha | null): boolean => this.canchaService.compareCancha(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserva }) => {
      this.reserva = reserva;
      if (reserva) {
        this.updateForm(reserva);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reserva = this.reservaFormService.getReserva(this.editForm);
    if (reserva.id !== null) {
      this.subscribeToSaveResponse(this.reservaService.update(reserva));
    } else {
      this.subscribeToSaveResponse(this.reservaService.create(reserva));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReserva>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(reserva: IReserva): void {
    this.reserva = reserva;
    this.reservaFormService.resetForm(this.editForm, reserva);

    this.pagosCollection = this.pagoService.addPagoToCollectionIfMissing<IPago>(this.pagosCollection, reserva.pago);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      reserva.usuario,
    );
    this.canchasSharedCollection = this.canchaService.addCanchaToCollectionIfMissing<ICancha>(this.canchasSharedCollection, reserva.cancha);
  }

  protected loadRelationshipsOptions(): void {
    this.pagoService
      .query({ filter: 'reserva-is-null' })
      .pipe(map((res: HttpResponse<IPago[]>) => res.body ?? []))
      .pipe(map((pagos: IPago[]) => this.pagoService.addPagoToCollectionIfMissing<IPago>(pagos, this.reserva?.pago)))
      .subscribe((pagos: IPago[]) => (this.pagosCollection = pagos));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.reserva?.usuario)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.canchaService
      .query()
      .pipe(map((res: HttpResponse<ICancha[]>) => res.body ?? []))
      .pipe(map((canchas: ICancha[]) => this.canchaService.addCanchaToCollectionIfMissing<ICancha>(canchas, this.reserva?.cancha)))
      .subscribe((canchas: ICancha[]) => (this.canchasSharedCollection = canchas));
  }
}
