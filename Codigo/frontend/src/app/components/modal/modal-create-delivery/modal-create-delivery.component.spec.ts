import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateDeliveryComponent } from './modal-create-delivery.component';

describe('ModalCreateDeliveryComponent', () => {
  let component: ModalCreateDeliveryComponent;
  let fixture: ComponentFixture<ModalCreateDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateDeliveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
