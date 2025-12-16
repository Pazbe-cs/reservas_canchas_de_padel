import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IReserva, NewReserva } from '../reserva.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReserva for edit and NewReservaFormGroupInput for create.
 */
type ReservaFormGroupInput = IReserva | PartialWithRequiredKeyOf<NewReserva>;

type ReservaFormDefaults = Pick<NewReserva, 'id'>;

type ReservaFormGroupContent = {
  id: FormControl<IReserva['id'] | NewReserva['id']>;
  fecha: FormControl<IReserva['fecha']>;
  horaInicio: FormControl<IReserva['horaInicio']>;
  horaFin: FormControl<IReserva['horaFin']>;
  pago: FormControl<IReserva['pago']>;
  usuario: FormControl<IReserva['usuario']>;
  cancha: FormControl<IReserva['cancha']>;
};

export type ReservaFormGroup = FormGroup<ReservaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReservaFormService {
  createReservaFormGroup(reserva: ReservaFormGroupInput = { id: null }): ReservaFormGroup {
    const reservaRawValue = {
      ...this.getFormDefaults(),
      ...reserva,
    };
    return new FormGroup<ReservaFormGroupContent>({
      id: new FormControl(
        { value: reservaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fecha: new FormControl(reservaRawValue.fecha, {
        validators: [Validators.required],
      }),
      horaInicio: new FormControl(reservaRawValue.horaInicio, {
        validators: [Validators.required],
      }),
      horaFin: new FormControl(reservaRawValue.horaFin, {
        validators: [Validators.required],
      }),
      pago: new FormControl(reservaRawValue.pago),
      usuario: new FormControl(reservaRawValue.usuario),
      cancha: new FormControl(reservaRawValue.cancha),
    });
  }

  getReserva(form: ReservaFormGroup): IReserva | NewReserva {
    return form.getRawValue() as IReserva | NewReserva;
  }

  resetForm(form: ReservaFormGroup, reserva: ReservaFormGroupInput): void {
    const reservaRawValue = { ...this.getFormDefaults(), ...reserva };
    form.reset(
      {
        ...reservaRawValue,
        id: { value: reservaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReservaFormDefaults {
    return {
      id: null,
    };
  }
}
