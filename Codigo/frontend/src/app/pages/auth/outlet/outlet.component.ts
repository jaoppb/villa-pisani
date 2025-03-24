import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconsComponent } from '../../../components/icons/icons.component';

@Component({
  selector: 'app-outlet',
  imports: [RouterOutlet, IconsComponent],
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.scss'
})
export class OutletComponent {

}
