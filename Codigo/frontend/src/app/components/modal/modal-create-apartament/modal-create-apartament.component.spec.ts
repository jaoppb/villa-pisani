import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateApartamentComponent } from './modal-create-apartament.component';

describe('ModalCreateApartamentComponent', () => {
  let component: ModalCreateApartamentComponent;
  let fixture: ComponentFixture<ModalCreateApartamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateApartamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateApartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
