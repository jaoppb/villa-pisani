import { Component, EventEmitter, Input, Output } from '@angular/core';
import { text } from 'stream/consumers';
import { TextAreaComponent } from '../../input/text-area/text-area.component';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { RulesService } from '../../../services/rules.service';
import { Rule } from '../../../model/rules.model';

@Component({
  selector: 'app-modal-create-rules',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent, TextAreaComponent],
  templateUrl: './modal-create-rules.component.html',
  styleUrl: './modal-create-rules.component.scss'
})
export class ModalCreateRulesComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() newRule = new EventEmitter<Rule>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly rulesService: RulesService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  submit() {
    if (this.form.valid) {
      this.rulesService.createRule(this.form.value).subscribe({
        next: (response) => {
          if (!response.body) {
            console.error('No rule created, response body is empty');
            return;
          }
          console.log('Rule created successfully:', response);
          this.form.reset();
          this.newRule.emit(response.body);
          this.handleIsOpenChange(false);
        },
        error: (error) => {
          console.error('Error creating rule:', error);
        }
      });
    } else {
      console.error('Form is invalid:', this.form.errors);
    }
  }

}
