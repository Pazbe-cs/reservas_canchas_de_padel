import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PagoDetailComponent } from './pago-detail.component';

describe('Pago Management Detail Component', () => {
  let comp: PagoDetailComponent;
  let fixture: ComponentFixture<PagoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./pago-detail.component').then(m => m.PagoDetailComponent),
              resolve: { pago: () => of({ id: 1660 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PagoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load pago on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PagoDetailComponent);

      // THEN
      expect(instance.pago()).toEqual(expect.objectContaining({ id: 1660 }));
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
