import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../cancha.test-samples';

import { CanchaFormService } from './cancha-form.service';

describe('Cancha Form Service', () => {
  let service: CanchaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanchaFormService);
  });

  describe('Service methods', () => {
    describe('createCanchaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCanchaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            tipo: expect.any(Object),
            precio: expect.any(Object),
          }),
        );
      });

      it('passing ICancha should create a new form with FormGroup', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            tipo: expect.any(Object),
            precio: expect.any(Object),
          }),
        );
      });
    });

    describe('getCancha', () => {
      it('should return NewCancha for default Cancha initial value', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithNewData);

        const cancha = service.getCancha(formGroup) as any;

        expect(cancha).toMatchObject(sampleWithNewData);
      });

      it('should return NewCancha for empty Cancha initial value', () => {
        const formGroup = service.createCanchaFormGroup();

        const cancha = service.getCancha(formGroup) as any;

        expect(cancha).toMatchObject({});
      });

      it('should return ICancha', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithRequiredData);

        const cancha = service.getCancha(formGroup) as any;

        expect(cancha).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICancha should not enable id FormControl', () => {
        const formGroup = service.createCanchaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCancha should disable id FormControl', () => {
        const formGroup = service.createCanchaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
