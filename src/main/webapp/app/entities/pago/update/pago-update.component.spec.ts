import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { PagoService } from '../service/pago.service';
import { IPago } from '../pago.model';
import { PagoFormService } from './pago-form.service';

import { PagoUpdateComponent } from './pago-update.component';

describe('Pago Management Update Component', () => {
  let comp: PagoUpdateComponent;
  let fixture: ComponentFixture<PagoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pagoFormService: PagoFormService;
  let pagoService: PagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PagoUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PagoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PagoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pagoFormService = TestBed.inject(PagoFormService);
    pagoService = TestBed.inject(PagoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const pago: IPago = { id: 25202 };

      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      expect(comp.pago).toEqual(pago);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPago>>();
      const pago = { id: 1660 };
      jest.spyOn(pagoFormService, 'getPago').mockReturnValue(pago);
      jest.spyOn(pagoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pago }));
      saveSubject.complete();

      // THEN
      expect(pagoFormService.getPago).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pagoService.update).toHaveBeenCalledWith(expect.objectContaining(pago));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPago>>();
      const pago = { id: 1660 };
      jest.spyOn(pagoFormService, 'getPago').mockReturnValue({ id: null });
      jest.spyOn(pagoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pago: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pago }));
      saveSubject.complete();

      // THEN
      expect(pagoFormService.getPago).toHaveBeenCalled();
      expect(pagoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPago>>();
      const pago = { id: 1660 };
      jest.spyOn(pagoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pago });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pagoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
