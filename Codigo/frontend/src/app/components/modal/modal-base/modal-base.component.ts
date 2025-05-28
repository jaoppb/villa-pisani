import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconsComponent } from '../../icons/iconBase/icons.component';

@Component({
  selector: 'app-modal-base',
  imports: [IconsComponent],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss'
})
export class ModalBaseComponent {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();

  closeModal() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }
}
