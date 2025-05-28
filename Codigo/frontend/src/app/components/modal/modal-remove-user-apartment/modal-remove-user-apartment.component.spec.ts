import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRemoveUserApartmentComponent } from './modal-remove-user-apartment.component';

describe('ModalRemoveUserApartmentComponent', () => {
  let component: ModalRemoveUserApartmentComponent;
  let fixture: ComponentFixture<ModalRemoveUserApartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRemoveUserApartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRemoveUserApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
