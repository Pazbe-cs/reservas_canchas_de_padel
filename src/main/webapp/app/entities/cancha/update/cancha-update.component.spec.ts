import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { CanchaService } from '../service/cancha.service';
import { ICancha } from '../cancha.model';
import { CanchaFormService } from './cancha-form.service';

import { CanchaUpdateComponent } from './cancha-update.component';

describe('Cancha Management Update Component', () => {
  let comp: CanchaUpdateComponent;
  let fixture: ComponentFixture<CanchaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let canchaFormService: CanchaFormService;
  let canchaService: CanchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CanchaUpdateComponent],
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
      .overrideTemplate(CanchaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CanchaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    canchaFormService = TestBed.inject(CanchaFormService);
    canchaService = TestBed.inject(CanchaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const cancha: ICancha = { id: 15070 };

      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      expect(comp.cancha).toEqual(cancha);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICancha>>();
      const cancha = { id: 16283 };
      jest.spyOn(canchaFormService, 'getCancha').mockReturnValue(cancha);
      jest.spyOn(canchaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cancha }));
      saveSubject.complete();

      // THEN
      expect(canchaFormService.getCancha).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(canchaService.update).toHaveBeenCalledWith(expect.objectContaining(cancha));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICancha>>();
      const cancha = { id: 16283 };
      jest.spyOn(canchaFormService, 'getCancha').mockReturnValue({ id: null });
      jest.spyOn(canchaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cancha: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cancha }));
      saveSubject.complete();

      // THEN
      expect(canchaFormService.getCancha).toHaveBeenCalled();
      expect(canchaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICancha>>();
      const cancha = { id: 16283 };
      jest.spyOn(canchaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cancha });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(canchaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
