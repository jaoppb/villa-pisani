import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExpensesComponent } from './modal-expenses.component';

describe('ModalExpensesComponent', () => {
  let component: ModalExpensesComponent;
  let fixture: ComponentFixture<ModalExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
