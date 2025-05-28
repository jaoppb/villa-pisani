import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';

@Component({
  selector: 'app-home',
  imports: [IconsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
