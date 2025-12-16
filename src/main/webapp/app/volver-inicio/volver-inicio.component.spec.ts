import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolverInicioComponent } from './volver-inicio.component';

describe('VolverInicioComponent', () => {
  let component: VolverInicioComponent;
  let fixture: ComponentFixture<VolverInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolverInicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolverInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
