import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalBaseComponent } from '../modal-base/modal-base.component';
import { ApartmentService } from '../../../services/apartment.service';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-modal-apartment-invite',
  imports: [ModalBaseComponent, QRCodeComponent],
  templateUrl: './modal-apartment-invite.component.html',
  styleUrl: './modal-apartment-invite.component.scss'
})
export class ModalApartmentInviteComponent implements OnInit {
  @Input() isOpen: boolean = true;
  @Input() apartmentId!: number;
  @Output() isOpenChange = new EventEmitter<boolean>();
  link: string = '/auth/login?invite=';

  constructor(
    private apartmentService: ApartmentService,
  ) {}

  ngOnInit() {
    this.apartmentService.createInvite(this.apartmentId).subscribe({
      next: (response) => {
        this.link += response.body?.inviteToken;
      },
      error: (err) => {
        console.error('Failed to create invite:', err);
      }
    });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  copyLink(): void {
    const link = `${window.location.origin}${this.link}`;
    navigator.clipboard.writeText(link).then(() => {
      console.log('Link copied to clipboard:', link);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }

}
