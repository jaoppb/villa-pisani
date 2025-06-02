import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeliveryService } from '../../../services/delivery.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { ModalBaseComponent } from '../modal-base/modal-base.component';

@Component({
  selector: 'app-modal-create-delivery',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './modal-create-delivery.component.html',
  styleUrl: './modal-create-delivery.component.scss'
})
export class ModalCreateDeliveryComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService
  ) {
    this.form = this.fb.group({
      sender: ['', [Validators.required, Validators.minLength(3)]],
      recipient: ['', [Validators.required, Validators.minLength(3)]],
      apartment: [null, [Validators.min(1), Validators.max(9999)]],
    })
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  submit() {
    if (this.form.valid) {
      this.deliveryService.createDelivery(this.form.value).subscribe({
        next: (response) => {
          console.log('Delivery created successfully:', response);
          this.handleIsOpenChange(false);
        },
        error: (error) => {
          console.error('Error creating delivery:', error);
        }
      });
    } else {
      console.warn('Form is invalid:', this.form.errors);
    }
  }
}
