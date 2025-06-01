import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { Delivery } from '../../../model/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { CustomInputComponent } from '../../input/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-confirm-delivery',
  imports: [ModalBaseComponent, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './modal-confirm-delivery.component.html',
  styleUrl: './modal-confirm-delivery.component.scss'
})
export class ModalConfirmDeliveryComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() delivery!: Delivery

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService
  ) {
    this.form = this.fb.group({
      deliveredTo: ['', [Validators.required, Validators.minLength(3)]],
    })
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(this.isOpen);
  }

  submit() {
    if (this.form.valid) {
      this.deliveryService.confirmDelivery(this.delivery.id, this.form.value).subscribe({
        next: (response) => {
          this.delivery = response.body as Delivery;
          this.handleIsOpenChange(false);
        },
        error: (error) => {
          console.error('Error confirming delivery:', error);
        }
      });
    }
  }
}
