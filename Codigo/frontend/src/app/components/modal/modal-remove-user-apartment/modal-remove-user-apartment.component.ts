import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { User } from '../../../model/user.model';
import { ApartmentService } from '../../../services/apartment.service';

@Component({
  selector: 'app-modal-remove-user-apartment',
  imports: [ModalBaseComponent],
  templateUrl: './modal-remove-user-apartment.component.html',
  styleUrl: './modal-remove-user-apartment.component.scss'
})
export class ModalRemoveUserApartmentComponent {
  @Input() isOpen: boolean = true;
  @Input() user!: User;
  @Input() apartmentId!: number;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() removeUser = new EventEmitter<string>();

  constructor(
    private apartmentService: ApartmentService,
  ) {}

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(this.isOpen);
  }

  handleRemoveUser(): void {
    this.apartmentService.deleteInhabitant(this.apartmentId, this.user.id).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.handleIsOpenChange(false);
          this.removeUser.emit(this.user.id);
        }
      },
      error: (err) => {
        // TODO: handle error
        console.error(err);
        this.handleIsOpenChange(false);
      },
    });
  };
}
