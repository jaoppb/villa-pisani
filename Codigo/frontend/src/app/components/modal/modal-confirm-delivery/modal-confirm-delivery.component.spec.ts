import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmDeliveryComponent } from './modal-confirm-delivery.component';

describe('ModalConfirmDeliveryComponent', () => {
  let component: ModalConfirmDeliveryComponent;
  let fixture: ComponentFixture<ModalConfirmDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
