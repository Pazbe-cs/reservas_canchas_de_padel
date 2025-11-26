import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPago } from 'app/entities/pago/pago.model';
import { PagoService } from 'app/entities/pago/service/pago.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ICancha } from 'app/entities/cancha/cancha.model';
import { CanchaService } from 'app/entities/cancha/service/cancha.service';
import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';
import { ReservaFormService } from './reserva-form.service';

import { ReservaUpdateComponent } from './reserva-update.component';

describe('Reserva Management Update Component', () => {
  let comp: ReservaUpdateComponent;
  let fixture: ComponentFixture<ReservaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reservaFormService: ReservaFormService;
  let reservaService: ReservaService;
  let pagoService: PagoService;
  let usuarioService: UsuarioService;
  let canchaService: CanchaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReservaUpdateComponent],
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
      .overrideTemplate(ReservaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReservaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservaFormService = TestBed.inject(ReservaFormService);
    reservaService = TestBed.inject(ReservaService);
    pagoService = TestBed.inject(PagoService);
    usuarioService = TestBed.inject(UsuarioService);
    canchaService = TestBed.inject(CanchaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call pago query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const pago: IPago = { id: 1660 };
      reserva.pago = pago;

      const pagoCollection: IPago[] = [{ id: 1660 }];
      jest.spyOn(pagoService, 'query').mockReturnValue(of(new HttpResponse({ body: pagoCollection })));
      const expectedCollection: IPago[] = [pago, ...pagoCollection];
      jest.spyOn(pagoService, 'addPagoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(pagoService.query).toHaveBeenCalled();
      expect(pagoService.addPagoToCollectionIfMissing).toHaveBeenCalledWith(pagoCollection, pago);
      expect(comp.pagosCollection).toEqual(expectedCollection);
    });

    it('should call Usuario query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const usuario: IUsuario = { id: 544 };
      reserva.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 544 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining),
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('should call Cancha query and add missing value', () => {
      const reserva: IReserva = { id: 8835 };
      const cancha: ICancha = { id: 16283 };
      reserva.cancha = cancha;

      const canchaCollection: ICancha[] = [{ id: 16283 }];
      jest.spyOn(canchaService, 'query').mockReturnValue(of(new HttpResponse({ body: canchaCollection })));
      const additionalCanchas = [cancha];
      const expectedCollection: ICancha[] = [...additionalCanchas, ...canchaCollection];
      jest.spyOn(canchaService, 'addCanchaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(canchaService.query).toHaveBeenCalled();
      expect(canchaService.addCanchaToCollectionIfMissing).toHaveBeenCalledWith(
        canchaCollection,
        ...additionalCanchas.map(expect.objectContaining),
      );
      expect(comp.canchasSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const reserva: IReserva = { id: 8835 };
      const pago: IPago = { id: 1660 };
      reserva.pago = pago;
      const usuario: IUsuario = { id: 544 };
      reserva.usuario = usuario;
      const cancha: ICancha = { id: 16283 };
      reserva.cancha = cancha;

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(comp.pagosCollection).toContainEqual(pago);
      expect(comp.usuariosSharedCollection).toContainEqual(usuario);
      expect(comp.canchasSharedCollection).toContainEqual(cancha);
      expect(comp.reserva).toEqual(reserva);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReserva>>();
      const reserva = { id: 15097 };
      jest.spyOn(reservaFormService, 'getReserva').mockReturnValue(reserva);
      jest.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reserva }));
      saveSubject.complete();

      // THEN
      expect(reservaFormService.getReserva).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservaService.update).toHaveBeenCalledWith(expect.objectContaining(reserva));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReserva>>();
      const reserva = { id: 15097 };
      jest.spyOn(reservaFormService, 'getReserva').mockReturnValue({ id: null });
      jest.spyOn(reservaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reserva }));
      saveSubject.complete();

      // THEN
      expect(reservaFormService.getReserva).toHaveBeenCalled();
      expect(reservaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReserva>>();
      const reserva = { id: 15097 };
      jest.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePago', () => {
      it('should forward to pagoService', () => {
        const entity = { id: 1660 };
        const entity2 = { id: 25202 };
        jest.spyOn(pagoService, 'comparePago');
        comp.comparePago(entity, entity2);
        expect(pagoService.comparePago).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUsuario', () => {
      it('should forward to usuarioService', () => {
        const entity = { id: 544 };
        const entity2 = { id: 13162 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
