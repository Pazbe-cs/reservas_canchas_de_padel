import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { CanchaDetailComponent } from './cancha-detail.component';

describe('Cancha Management Detail Component', () => {
  let comp: CanchaDetailComponent;
  let fixture: ComponentFixture<CanchaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanchaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./cancha-detail.component').then(m => m.CanchaDetailComponent),
              resolve: { cancha: () => of({ id: 16283 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CanchaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanchaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load cancha on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CanchaDetailComponent);

      // THEN
      expect(instance.cancha()).toEqual(expect.objectContaining({ id: 16283 }));
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
