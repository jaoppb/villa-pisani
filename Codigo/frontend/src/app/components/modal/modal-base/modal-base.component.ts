import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { IconsComponent } from '../../icons/iconBase/icons.component';

@Component({
  selector: 'app-modal-base',
  imports: [IconsComponent],
  templateUrl: './modal-base.component.html',
  styleUrl: './modal-base.component.scss'
})
export class ModalBaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isOpen: boolean = true;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @ViewChild('modalRoot') modalRoot!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.handleIsOpenChange(true);
  }

  ngAfterViewInit() {
    this.focusModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleIsOpenChange(isOpen: boolean): void {
    this.isOpen = isOpen;
    this.isOpenChange.emit(this.isOpen);
    if (!isOpen)
      document.body.style.overflow = '';
    else
      document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.handleIsOpenChange(false);
  }

  ngOnInit() {
    window.addEventListener('keydown', this.handleEsc);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleEsc);
  }

  focusModal() {
    if (this.isOpen && this.modalRoot) {
      setTimeout(() => this.modalRoot.nativeElement.focus(), 0);
    }
  }

  handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      this.closeModal();
    }
  };
}
