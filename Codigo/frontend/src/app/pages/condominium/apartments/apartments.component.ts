import { Component } from '@angular/core';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { RouterModule } from '@angular/router';
import { MetaData } from '../../../services/meta-data.service';
import { ApartmentService } from '../../../services/apartment.service';
import { Apartments } from '../../../model/apartment.model';
import { ModalCreateApartamentComponent } from '../../../components/modal/modal-create-apartament/modal-create-apartament.component';
import { AccessTokenService } from '../../../services/accessToken.service';
import { ModalCreateBillComponent } from '../../../components/modal/modal-create-bill/modal-create-bill.component';

@Component({
  selector: 'app-apartments',
  imports: [ModalCreateApartamentComponent, IconsComponent, RouterModule, ModalCreateBillComponent],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent {
  apartments: Apartments[] = [];
  // Modal
  IsOpenModalCreateApartment: boolean = false;
  IsOpenModalCreateBill: boolean = true;

  constructor(
    private meta: MetaData,
    private apartmentService: ApartmentService,
    private tokenStorage: AccessTokenService
  ) {
    this.meta.setMetaData({
      title: 'Apartamentos',
      description: 'Apartamentos do condomínio',
      keywords: 'apartamentos, condomínio, vila pisane',
    });
    this.getApartments();
  }

  async getApartments() {
    const response = await this.apartmentService.getApartments().toPromise();
    this.apartments = response?.body as any[] || [];
  }

  public isAdmin() {
    return this.tokenStorage.hasManager;
  }

  openModalCreateApartment() {
    this.IsOpenModalCreateApartment = true;
  }

  openModalCreateBill() {
    this.IsOpenModalCreateBill = true;
  }

  handleCreateApartment(apartment: Apartments): void {
    this.apartments.push(apartment);
    this.IsOpenModalCreateApartment = false;
  }
}
