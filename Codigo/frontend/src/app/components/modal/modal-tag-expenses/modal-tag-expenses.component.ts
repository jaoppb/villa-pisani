import { Component, Input, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { ExpenseService } from '../../../services/expense.service';

@Component({
  selector: 'app-modal-tag-expenses',
  imports: [ModalBaseComponent, CustomInputComponent, ReactiveFormsModule],
  templateUrl: './modal-tag-expenses.component.html',
  styleUrl: './modal-tag-expenses.component.scss'
})
export class ModalTagExpensesComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newExpense = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
  ) {
    this.form = this.fb.group({
      label: ['', []],
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  // TODO Retorna erro no template
  submit() {
    if (this.form.valid) {
      const tag = this.form.value.label;
      this.expenseService.createTag(tag).subscribe((res: any) => {
        this.newExpense.emit(res);
        this.handleIsOpenChange(false);
      });
    }
  }
}
