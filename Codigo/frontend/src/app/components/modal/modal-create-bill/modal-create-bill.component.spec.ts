import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateBillComponent } from './modal-create-bill.component';

describe('ModalCreateBillComponent', () => {
  let component: ModalCreateBillComponent;
  let fixture: ComponentFixture<ModalCreateBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCreateBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
