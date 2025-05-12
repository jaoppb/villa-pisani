import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ApartmentService } from '../../../services/apartment.service';
import { AccessTokenService } from '../../../services/accessToken.service';
import { Apartments } from '../../../model/apartment.model';
import { User } from '../../../model/user.model';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { ModalRemoveUserApartmentComponent } from '../../../components/modal/modal-remove-user-apartment/modal-remove-user-apartment.component';
import { ModalApartmentInviteComponent } from '../../../components/modal/modal-apartment-invite/modal-apartment-invite.component';

@Component({
  selector: 'app-apartment',
  imports: [IconsComponent, RouterModule, ModalRemoveUserApartmentComponent, ModalApartmentInviteComponent],
  templateUrl: './apartment.component.html',
  styleUrl: './apartment.component.scss'
})
export class ApartmentComponent {
  apartment!: Apartments;
  users: User[] = [];
  isOpenModalRemoveUser: boolean = false;
  isOpenModalInvite: boolean = false;
  userToRemove!: User;
  openModalInvites: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apartmentService: ApartmentService,
    private userService: UserService,
    private tokenStorage: AccessTokenService
  ) {
    this.route.params.subscribe(params => {
      let apartmentId = params['number'];
      if (!apartmentId) {
        this.userService.getUserLogin().subscribe((res: any) => {
          if (res.body) {
            apartmentId = res.body.apartment.number;
          }
        });
      }
      this.apartmentService.getApartment(apartmentId).subscribe((res: any) => {
        if (res.body) {
          this.apartment = res.body;
          this.getUsers(res.body.number);
        }
      });
    });
  }

  getUsers(apartmentId: number) {
    this.apartmentService.getInhabitants(apartmentId).subscribe((res: any) => {
      if (res.body) {
        this.users = res.body
      }
    });
  }

  invite() {
    this.isOpenModalInvite = true;
    this.isOpenModalRemoveUser = false;
  }

  public isAdmin() {
    return this.tokenStorage.hasManager;
  }

  openModalRemoveUser(user: User): void {
    this.userToRemove = user;
    this.isOpenModalRemoveUser = true;
  }
  handleIsOpenRemoveUserChange(isOpen: boolean): void {
    this.isOpenModalRemoveUser = isOpen;
  }

  handleRemoveUser(userId: string): void {
    this.users = this.users.filter(user => user.id !== userId);
  }

  handleIsOpenInviteChange(isOpen: boolean): void {
    this.isOpenModalInvite = isOpen;
  }
}
