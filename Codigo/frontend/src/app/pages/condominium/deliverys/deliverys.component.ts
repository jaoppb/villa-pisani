import { Component } from '@angular/core';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { DeliveryService } from '../../../services/delivery.service';
import { Delivery, DeliveryStatusMap } from '../../../model/delivery.model';
import { RouterModule } from '@angular/router';
import { ModalCreateDeliveryComponent } from '../../../components/modal/modal-create-delivery/modal-create-delivery.component';
import { AccessTokenService } from '../../../services/accessToken.service';

@Component({
  selector: 'app-deliverys',
  imports: [IconsComponent, RouterModule, ModalCreateDeliveryComponent],
  templateUrl: './deliverys.component.html',
  styleUrl: './deliverys.component.scss'
})
export class DeliverysComponent {
  deliveries: Delivery[] = [];
  mapStatus = DeliveryStatusMap;
  isOpenModalDeliveredCreate = false;

  constructor(
    private deliveryService: DeliveryService,
    private tokenStorage: AccessTokenService
  ) {
    this.getDeliveries();
  }

  async getDeliveries() {
    this.deliveryService.getDeliveries().subscribe((res: any) => {
      if (res.body) {
        this.deliveries = res.body;
      }
    });
  }

  isStaff() {
    return this.tokenStorage.hasManager || this.tokenStorage.hasEmployee;
  }

  modalDeliveredCreateChange(isOpen: boolean) {
    this.isOpenModalDeliveredCreate = isOpen;
    this.getDeliveries();
  }
}
