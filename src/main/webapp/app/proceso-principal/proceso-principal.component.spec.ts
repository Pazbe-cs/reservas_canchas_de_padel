import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoPrincipalComponent } from './proceso-principal.component';

describe('ProcesoPrincipalComponent', () => {
  let component: ProcesoPrincipalComponent;
  let fixture: ComponentFixture<ProcesoPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcesoPrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcesoPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
