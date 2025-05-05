import { Component } from '@angular/core';
import { DropboxComponent } from '../../../components/dropbox/dropbox.component';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { RouterModule } from '@angular/router';
import { MetaData } from '../../../services/meta-data.service';
import { ApartmentService } from '../../../services/apartment.service';
import { Apartments } from '../../../model/apartment.model';
import { ModalCreateApartamentComponent } from '../../../components/modal/modal-create-apartament/modal-create-apartament.component';
import { AccessTokenService } from '../../../services/accessToken.service';

@Component({
  selector: 'app-apartments',
  imports: [ModalCreateApartamentComponent, IconsComponent, RouterModule],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent {
  IsOpenModalCreateApartment: boolean = false;
  apartments: Apartments[] = [];

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleIsOpenCreateApartmentChange(isOpen: boolean): void {
    this.IsOpenModalCreateApartment = isOpen;
  }

  handleCreateApartment(apartment: Apartments): void {
    this.apartments.push(apartment);
    this.IsOpenModalCreateApartment = false;
  }
}
