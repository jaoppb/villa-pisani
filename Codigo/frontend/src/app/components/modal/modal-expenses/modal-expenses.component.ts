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
  ){
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
        return { required: true }; // Nenhum arquivo selecionado
      }
  
      for (const file of this.selectedFiles) {
        if (file.size > this.maxFileSize) {
          return { maxSize: true }; // Arquivo excede o tamanho máximo
        }
        if (!this.acceptedMimeTypes.includes(file.type)) {
          return { invalidType: true }; // Tipo de arquivo inválido
        }
      }
  
      return null; // Validação passou
    };
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files); // Armazena os arquivos selecionados
      this.form.get('files')?.updateValueAndValidity(); // Apenas revalida o campo
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.expenseService.createExpense(this.form.value as expenseRequest, this.selectedFiles).subscribe({
        next: (response: HttpResponse<expense>) => {
          const body: expense = response.body!;
          this.newExpense.emit(body);
          this.form.reset();
          this.selectedFiles = [];
          this.handleIsOpenChange(false);
        },
        error: (err: any) => {
          console.error('Erro ao criar despesa:', err);
          this.form.setErrors({ uploadFailed: true });
        },
      });
    } else {
      console.log('Formulário inválido:', this.form.errors);
    }
  }
}
