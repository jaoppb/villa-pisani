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
import { ModalUpdateUserComponent } from '../../../components/modal/modal-update-user/modal-update-user.component';
import { Delivery } from '../../../model/delivery.model';
import { Bill } from '../../../model/bill.model';

enum PageState {
	INHABITANT = 'inhabitant',
	BILL = 'bill',
	DELIVERY = 'delivery',
}

@Component({
	selector: 'app-apartment',
	imports: [IconsComponent, RouterModule, ModalRemoveUserApartmentComponent, ModalApartmentInviteComponent, ModalUpdateUserComponent],
	templateUrl: './apartment.component.html',
	styleUrl: './apartment.component.scss'
})
export class ApartmentComponent {
	apartment!: Apartments;
	users: User[] = [];
	deliveries: Delivery[] = [];
	bills: Bill[] = [];
	PageState = PageState;

	// Modal states
	isOpenModalRemoveUser: boolean = false;
	isOpenModalInvite: boolean = false;
	userToRemove!: User;
	openModalInvites: boolean = false;
	IsOpenModalUpdateUser: boolean = false;
	userUpdate!: User;

	// Types
	pageStade: PageState = PageState.INHABITANT;

	constructor(
		private route: ActivatedRoute,
		private apartmentService: ApartmentService,
		private userService: UserService,
		private tokenStorage: AccessTokenService
	) {
		this.route.params.subscribe(params => {
			if (params['number']) {
				const apartmentId = params['number'];
				this.apartmentService.getApartment(apartmentId).subscribe((res: any) => {
					if (res.body) {
						this.apartment = res.body;
						this.getUsers(res.body.number);
						this.getDeliveries(res.body.number);
						this.getBills(res.body.number);
					}
				});
			} else {
				this.apartmentService.getCurrentUserApartment().subscribe((res: any) => {
					if (res.body) {
						this.apartment = res.body;
						this.getUsers();
						this.getDeliveries();
						this.getBills();
					}
				});
			}
		});
	}

	getUsers(apartmentId?: number) {
		if (apartmentId !== undefined) {
			this.apartmentService.getInhabitants(apartmentId).subscribe((res: any) => {
				if (res.body) {
					this.users = res.body;
				}
			});
		} else {
			this.apartmentService.getCurrentUserApartmentInhabitants().subscribe((res: any) => {
				if (res.body) {
					this.users = res.body;
				}
			});
		}
	}

	getDeliveries(apartmentId?: number) {
		if (apartmentId !== undefined) {
			this.apartmentService.getDeliveries(apartmentId).subscribe((res: any) => {
				if (res.body) {
					this.deliveries = res.body;
				}
			});
		} else {
			this.apartmentService.getCurrentUserApartmentDeliveries().subscribe((res: any) => {
				if (res.body) {
					this.deliveries = res.body;
				}
			});
		}
	}

	getBills(apartmentId?: number) {
		if (apartmentId !== undefined) {
			this.apartmentService.getBills(apartmentId).subscribe((res: any) => {
				if (res.body) {
					this.bills = res.body;
				}
			});
		} else {
			this.apartmentService.getCurrentUserApartmentBills().subscribe((res: any) => {
				if (res.body) {
					this.bills = res.body;
				}
			});
		}
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

	handleRemoveUser(userId: string): void {
		this.users = this.users.filter(user => user.id !== userId);
	}

	handleUpdateUser(user: User): void {
		this.getUsers(this.apartment.number);
	}

	openModalUpdateUser(user: User) {
		this.userUpdate = user;
		this.IsOpenModalUpdateUser = true;
	}

	setPage(page: PageState) {
		this.pageStade = page;
	}

	formatDate(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		};
		return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
	}

	formatMoney(value: number): string {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(value);
	}
}
