import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { TextAreaComponent } from '../../input/text-area/text-area.component';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../../services/expense.service';
import { expense, expenseRequest } from '../../../model/expense.model';

@Component({
  selector: 'app-modal-expenses',
  imports: [ModalBaseComponent, TextAreaComponent, CustomInputComponent, ReactiveFormsModule],
  templateUrl: './modal-expenses.component.html',
  styleUrl: './modal-expenses.component.scss'
})
export class ModalExpensesComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newExpense = new EventEmitter<any>();
  form: FormGroup;
  selectedFiles: File[] = [];
  acceptedMimeTypes = ['application/pdf'];
  maxFileSize = 200 * 1024 * 1024; // 200MB

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
      tagIDs: [[], []],
      files: [null, [this.fileValidator()]],
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  fileValidator(): Validators {
    return () => {
      if (!this.selectedFiles || this.selectedFiles.length === 0) {
        return { required: true };
      }

      for (const file of this.selectedFiles) {
        if (file.size > this.maxFileSize) {
          return { maxSize: true };
        }
        if (!this.acceptedMimeTypes.includes(file.type)) {
          return { invalidType: true };
        }
      }
      return null;
    };
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.form.get('files')?.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      const expenseData: expenseRequest = {
        title: this.form.get('title')?.value,
        description: this.form.get('description')?.value,
        tagIDs: this.form.get('tagIDs')?.value,
        files: this.selectedFiles,
      };
      this.expenseService.createExpense(expenseData).then((response: HttpResponse<expense> | undefined) => {
        if (response && response.status === 201) {
          this.newExpense.emit(response.body);
          this.form.reset();
          this.selectedFiles = [];
          this.handleIsOpenChange(false);
        } else if (response) {
          console.error('Erro ao criar despesa:', response.statusText);
        } else {
          console.error('Erro ao criar despesa: resposta indefinida');
        }
      })
    } else {
      console.log('Formulário inválido:', this.form.errors);
    }
  }
}
