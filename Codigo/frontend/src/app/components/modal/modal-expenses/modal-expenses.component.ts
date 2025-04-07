import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { TextAreaComponent } from '../../input/text-area/text-area.component';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-expenses',
  imports: [ModalBaseComponent, TextAreaComponent, CustomInputComponent, ReactiveFormsModule],
  templateUrl: './modal-expenses.component.html',
  styleUrl: './modal-expenses.component.scss'
})
export class ModalExpensesComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newFeedBack = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ){
    this.form = this.fb.group({
      title: ['',[Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  submit(): void {
    
  }
}
