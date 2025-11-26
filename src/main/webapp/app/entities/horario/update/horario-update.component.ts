import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { IHorario } from '../horario.model';
import { HorarioService } from '../service/horario.service';
import { HorarioFormGroup, HorarioFormService } from './horario-form.service';

@Component({
  selector: 'jhi-horario-update',
  templateUrl: './horario-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class HorarioUpdateComponent implements OnInit {
  isSaving = false;
  horario: IHorario | null = null;

  canchasSharedCollection: ICancha[] = [];

  protected horarioService = inject(HorarioService);
  protected horarioFormService = inject(HorarioFormService);
  protected canchaService = inject(CanchaService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: HorarioFormGroup = this.horarioFormService.createHorarioFormGroup();

  compareCancha = (o1: ICancha | null, o2: ICancha | null): boolean => this.canchaService.compareCancha(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ horario }) => {
      this.horario = horario;
      if (horario) {
        this.updateForm(horario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const horario = this.horarioFormService.getHorario(this.editForm);
    if (horario.id !== null) {
      this.subscribeToSaveResponse(this.horarioService.update(horario));
    } else {
      this.subscribeToSaveResponse(this.horarioService.create(horario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHorario>>): void {
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

  protected updateForm(horario: IHorario): void {
    this.horario = horario;
    this.horarioFormService.resetForm(this.editForm, horario);

    this.canchasSharedCollection = this.canchaService.addCanchaToCollectionIfMissing<ICancha>(this.canchasSharedCollection, horario.cancha);
  }

  protected loadRelationshipsOptions(): void {
    this.canchaService
      .query()
      .pipe(map((res: HttpResponse<ICancha[]>) => res.body ?? []))
      .pipe(map((canchas: ICancha[]) => this.canchaService.addCanchaToCollectionIfMissing<ICancha>(canchas, this.horario?.cancha)))
      .subscribe((canchas: ICancha[]) => (this.canchasSharedCollection = canchas));
  }
}
