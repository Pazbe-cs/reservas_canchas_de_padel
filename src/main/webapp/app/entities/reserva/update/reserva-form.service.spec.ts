import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../reserva.test-samples';

import { ReservaFormService } from './reserva-form.service';

describe('Reserva Form Service', () => {
  let service: ReservaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaFormService);
  });

  describe('Service methods', () => {
    describe('createReservaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReservaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fecha: expect.any(Object),
            horaInicio: expect.any(Object),
            horaFin: expect.any(Object),
            pago: expect.any(Object),
            usuario: expect.any(Object),
            cancha: expect.any(Object),
          }),
        );
      });

      it('passing IReserva should create a new form with FormGroup', () => {
        const formGroup = service.createReservaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fecha: expect.any(Object),
            horaInicio: expect.any(Object),
            horaFin: expect.any(Object),
            pago: expect.any(Object),
            usuario: expect.any(Object),
            cancha: expect.any(Object),
          }),
        );
      });
    });

    describe('getReserva', () => {
      it('should return NewReserva for default Reserva initial value', () => {
        const formGroup = service.createReservaFormGroup(sampleWithNewData);

        const reserva = service.getReserva(formGroup) as any;

        expect(reserva).toMatchObject(sampleWithNewData);
      });

      it('should return NewReserva for empty Reserva initial value', () => {
        const formGroup = service.createReservaFormGroup();

        const reserva = service.getReserva(formGroup) as any;

        expect(reserva).toMatchObject({});
      });

      it('should return IReserva', () => {
        const formGroup = service.createReservaFormGroup(sampleWithRequiredData);

        const reserva = service.getReserva(formGroup) as any;

        expect(reserva).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IReserva should not enable id FormControl', () => {
        const formGroup = service.createReservaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewReserva should disable id FormControl', () => {
        const formGroup = service.createReservaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
