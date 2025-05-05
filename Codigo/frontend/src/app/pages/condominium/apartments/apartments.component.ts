import { Component } from '@angular/core';
import { DropboxComponent } from '../../../components/dropbox/dropbox.component';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { RouterModule } from '@angular/router';
import { MetaData } from '../../../services/meta-data.service';
import { ApartmentService } from '../../../services/apartment.service';
import { Apartments } from '../../../model/apartment.model';

@Component({
  selector: 'app-apartments',
  imports: [DropboxComponent, IconsComponent, RouterModule],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent {
  apartments: Apartments[] = [];

  constructor(
    private meta: MetaData,
    private apartmentService: ApartmentService,
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
}
