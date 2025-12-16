import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { HorarioService } from '../service/horario.service';
import { IHorario } from '../horario.model';
import { HorarioFormService } from './horario-form.service';

import { HorarioUpdateComponent } from './horario-update.component';

describe('Horario Management Update Component', () => {
  let comp: HorarioUpdateComponent;
  let fixture: ComponentFixture<HorarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let horarioFormService: HorarioFormService;
  let horarioService: HorarioService;
  let canchaService: CanchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HorarioUpdateComponent],
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
      .overrideTemplate(HorarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HorarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    horarioFormService = TestBed.inject(HorarioFormService);
    horarioService = TestBed.inject(HorarioService);
    canchaService = TestBed.inject(CanchaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Cancha query and add missing value', () => {
      const horario: IHorario = { id: 20541 };
      const cancha: ICancha = { id: 16283 };
      horario.cancha = cancha;

      const canchaCollection: ICancha[] = [{ id: 16283 }];
      jest.spyOn(canchaService, 'query').mockReturnValue(of(new HttpResponse({ body: canchaCollection })));
      const additionalCanchas = [cancha];
      const expectedCollection: ICancha[] = [...additionalCanchas, ...canchaCollection];
      jest.spyOn(canchaService, 'addCanchaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      expect(canchaService.query).toHaveBeenCalled();
      expect(canchaService.addCanchaToCollectionIfMissing).toHaveBeenCalledWith(
        canchaCollection,
        ...additionalCanchas.map(expect.objectContaining),
      );
      expect(comp.canchasSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const horario: IHorario = { id: 20541 };
      const cancha: ICancha = { id: 16283 };
      horario.cancha = cancha;

      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      expect(comp.canchasSharedCollection).toContainEqual(cancha);
      expect(comp.horario).toEqual(horario);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHorario>>();
      const horario = { id: 1086 };
      jest.spyOn(horarioFormService, 'getHorario').mockReturnValue(horario);
      jest.spyOn(horarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horario }));
      saveSubject.complete();

      // THEN
      expect(horarioFormService.getHorario).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(horarioService.update).toHaveBeenCalledWith(expect.objectContaining(horario));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHorario>>();
      const horario = { id: 1086 };
      jest.spyOn(horarioFormService, 'getHorario').mockReturnValue({ id: null });
      jest.spyOn(horarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: horario }));
      saveSubject.complete();

      // THEN
      expect(horarioFormService.getHorario).toHaveBeenCalled();
      expect(horarioService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHorario>>();
      const horario = { id: 1086 };
      jest.spyOn(horarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ horario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(horarioService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCancha', () => {
      it('should forward to canchaService', () => {
        const entity = { id: 16283 };
        const entity2 = { id: 15070 };
        jest.spyOn(canchaService, 'compareCancha');
        comp.compareCancha(entity, entity2);
        expect(canchaService.compareCancha).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
