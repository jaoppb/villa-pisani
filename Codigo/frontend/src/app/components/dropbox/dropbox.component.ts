import { Component, Input } from '@angular/core';
import { IconsComponent } from '../icons/iconBase/icons.component';

@Component({
  selector: 'app-dropbox',
  imports: [IconsComponent],
  templateUrl: './dropbox.component.html',
  styleUrl: './dropbox.component.scss'
})
export class DropboxComponent {
  @Input() title: string = 'dropbox';
  @Input() Open: boolean = false;

  public toggle() {
    this.Open = !this.Open;
  }
}
