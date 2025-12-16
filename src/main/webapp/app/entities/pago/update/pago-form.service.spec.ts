import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../pago.test-samples';

import { PagoFormService } from './pago-form.service';

describe('Pago Form Service', () => {
  let service: PagoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoFormService);
  });

  describe('Service methods', () => {
    describe('createPagoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPagoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fecha: expect.any(Object),
            monto: expect.any(Object),
          }),
        );
      });

      it('passing IPago should create a new form with FormGroup', () => {
        const formGroup = service.createPagoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fecha: expect.any(Object),
            monto: expect.any(Object),
          }),
        );
      });
    });

    describe('getPago', () => {
      it('should return NewPago for default Pago initial value', () => {
        const formGroup = service.createPagoFormGroup(sampleWithNewData);

        const pago = service.getPago(formGroup) as any;

        expect(pago).toMatchObject(sampleWithNewData);
      });

      it('should return NewPago for empty Pago initial value', () => {
        const formGroup = service.createPagoFormGroup();

        const pago = service.getPago(formGroup) as any;

        expect(pago).toMatchObject({});
      });

      it('should return IPago', () => {
        const formGroup = service.createPagoFormGroup(sampleWithRequiredData);

        const pago = service.getPago(formGroup) as any;

        expect(pago).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPago should not enable id FormControl', () => {
        const formGroup = service.createPagoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPago should disable id FormControl', () => {
        const formGroup = service.createPagoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
