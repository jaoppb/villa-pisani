import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmReceiptComponent } from './modal-confirm-receipt.component';

describe('ModalConfirmReceiptComponent', () => {
  let component: ModalConfirmReceiptComponent;
  let fixture: ComponentFixture<ModalConfirmReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
