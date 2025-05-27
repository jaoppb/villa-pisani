import { Component } from '@angular/core';
import { Delivery, DeliveryStatusMap } from '../../../model/delivery.model';
import { DeliveryService } from '../../../services/delivery.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccessTokenService } from '../../../services/accessToken.service';
import { ModalConfirmReceiptComponent } from '../../../components/modal/modal-confirm-receipt/modal-confirm-receipt.component';
import { ModalConfirmDeliveryComponent } from '../../../components/modal/modal-confirm-delivery/modal-confirm-delivery.component';

@Component({
  selector: 'app-delivery',
  imports: [RouterModule, ModalConfirmReceiptComponent, ModalConfirmDeliveryComponent],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent {
  delivery!: Delivery;
  mapStatus = DeliveryStatusMap;
  isOpenModalDeliveredConfirmed: boolean = false;
  isOpenModalDeliveredDelivered: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private deliveryService: DeliveryService,
    private tokenStorage: AccessTokenService
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getDelivery(params['id']);
      }
    });
  }

  async getDelivery(id: string) {
    this.deliveryService.getDelivery(id).subscribe((res: any) => {
      if (res.body) {
        this.delivery = res.body;
        console.log('Delivery data:', this.delivery);
      }
    });
  }

  formatDate(date: string | null) {
    if (date) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      return new Date(date).toLocaleString('pt-BR', options);
    }
    return 'N/A';
  }

  isStaff() {
    return this.tokenStorage.hasManager || this.tokenStorage.hasEmployee;
  }

  isInhabitant() {
    return this.tokenStorage.hasInhabitant;
  }

  modalConfirmDeliveryChange(isOpen: boolean): void {
    this.isOpenModalDeliveredDelivered = isOpen;
    this.getDelivery(this.delivery.id);
  }

  modalConfirmReceiptChange(isOpen: boolean): void {
    this.isOpenModalDeliveredConfirmed = isOpen;
    this.getDelivery(this.delivery.id);
  }
}
