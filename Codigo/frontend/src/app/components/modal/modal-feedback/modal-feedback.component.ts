import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { TextAreaComponent } from '../../input/text-area/text-area.component';
import { CheckboxComponent } from '../../input/checkbox/checkbox.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackService } from '../../../services/feedback.service';
import { feedbackResponse } from '../../../model/feedback.model';

@Component({
  selector: 'app-modal-feedback',
  imports: [ModalBaseComponent, CheckboxComponent, TextAreaComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './modal-feedback.component.html',
  styleUrl: './modal-feedback.component.scss'
})
export class ModalFeedbackComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newFeedBack = new EventEmitter<feedbackResponse>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
  ) {
    this.form = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      anonymous: [false, []],
    });
  }
  // TODO: retorna erros de validação para o template

  submit(): void {
    console.log(this.form.value);
    this.feedbackService.createFeedback(this.form.value).subscribe({
      next: (response) => {
        const body: feedbackResponse | null = response.body;
        if (body) {
          this.newFeedBack.emit(body);
          this.form.reset();
          this.handleIsOpenChange(false);
        }
      },
      error: (err) => {
        this.form.setErrors({ loginFailed: true });
      },
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(this.isOpen);
    if (!isOpen) {
      this.form.reset();
    }
  }
}
