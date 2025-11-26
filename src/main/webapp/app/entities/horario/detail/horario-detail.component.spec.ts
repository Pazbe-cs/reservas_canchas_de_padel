import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { HorarioDetailComponent } from './horario-detail.component';

describe('Horario Management Detail Component', () => {
  let comp: HorarioDetailComponent;
  let fixture: ComponentFixture<HorarioDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./horario-detail.component').then(m => m.HorarioDetailComponent),
              resolve: { horario: () => of({ id: 1086 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(HorarioDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorarioDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load horario on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', HorarioDetailComponent);

      // THEN
      expect(instance.horario()).toEqual(expect.objectContaining({ id: 1086 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
