import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';

@Component({
  selector: 'app-outlet',
  imports: [RouterOutlet, ThemeToggleComponent, IconsComponent],
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.scss'
})
export class OutletComponent {
  isSidebarOpen: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
