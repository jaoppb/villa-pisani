import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTagExpensesComponent } from './modal-tag-expenses.component';

describe('ModalTagExpensesComponent', () => {
  let component: ModalTagExpensesComponent;
  let fixture: ComponentFixture<ModalTagExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTagExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTagExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
