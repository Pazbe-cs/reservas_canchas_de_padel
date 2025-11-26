import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IHorario, NewHorario } from '../horario.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHorario for edit and NewHorarioFormGroupInput for create.
 */
type HorarioFormGroupInput = IHorario | PartialWithRequiredKeyOf<NewHorario>;

type HorarioFormDefaults = Pick<NewHorario, 'id'>;

type HorarioFormGroupContent = {
  id: FormControl<IHorario['id'] | NewHorario['id']>;
  dia: FormControl<IHorario['dia']>;
  horaInicio: FormControl<IHorario['horaInicio']>;
  horaFin: FormControl<IHorario['horaFin']>;
  cancha: FormControl<IHorario['cancha']>;
};

export type HorarioFormGroup = FormGroup<HorarioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HorarioFormService {
  createHorarioFormGroup(horario: HorarioFormGroupInput = { id: null }): HorarioFormGroup {
    const horarioRawValue = {
      ...this.getFormDefaults(),
      ...horario,
    };
    return new FormGroup<HorarioFormGroupContent>({
      id: new FormControl(
        { value: horarioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dia: new FormControl(horarioRawValue.dia, {
        validators: [Validators.required],
      }),
      horaInicio: new FormControl(horarioRawValue.horaInicio, {
        validators: [Validators.required],
      }),
      horaFin: new FormControl(horarioRawValue.horaFin, {
        validators: [Validators.required],
      }),
      cancha: new FormControl(horarioRawValue.cancha),
    });
  }

  getHorario(form: HorarioFormGroup): IHorario | NewHorario {
    return form.getRawValue() as IHorario | NewHorario;
  }

  resetForm(form: HorarioFormGroup, horario: HorarioFormGroupInput): void {
    const horarioRawValue = { ...this.getFormDefaults(), ...horario };
    form.reset(
      {
        ...horarioRawValue,
        id: { value: horarioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): HorarioFormDefaults {
    return {
      id: null,
    };
  }
}
