import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery } from '../../../model/delivery.model';

@Component({
  selector: 'app-modal-confirm-receipt',
  imports: [ModalBaseComponent],
  templateUrl: './modal-confirm-receipt.component.html',
  styleUrl: './modal-confirm-receipt.component.scss'
})
export class ModalConfirmReceiptComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() delivery!: Delivery

  constructor(
    private deliveryService: DeliveryService
  ) {}

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen
    this.isOpenChange.emit(this.isOpen);
  }

  confirmReceipt(): void {
    this.deliveryService.confirmReceipt(this.delivery.id).subscribe({
      next: () => {
        console.log('Delivery receipt confirmed successfully');
        this.handleIsOpenChange(false);
      },
      error: (error) => {
        console.error('Error confirming delivery receipt:', error);
      }
    });
  }


}
