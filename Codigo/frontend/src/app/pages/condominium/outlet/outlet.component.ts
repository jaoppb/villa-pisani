import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { IconsComponent } from '../../../components/icons/iconBase/icons.component';
import { AccessTokenService } from '../../../services/accessToken.service';

@Component({
  selector: 'app-outlet',
  imports: [RouterOutlet, ThemeToggleComponent, IconsComponent, RouterModule],
  templateUrl: './outlet.component.html',
  styleUrl: './outlet.component.scss'
})
export class OutletComponent {
  isSidebarOpen: boolean = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  constructor(
    private readonly accessTokenService: AccessTokenService
  ) {}

  isAdmin(): boolean {
    return this.accessTokenService.hasManager;
  }

  isInhabitant(): boolean {
    return this.accessTokenService.hasInhabitant;
  }

  isEmployee(): boolean {
    return this.accessTokenService.hasEmployee;
  }
}
