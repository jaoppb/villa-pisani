import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { ThemeManagerService } from '../../services/theme-manager.service';
import { IconsComponent } from '../icons/icons.component';

@Component({
  selector: 'app-theme-toggle',
  imports: [IconsComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent{
  private readonly themeManagerService = inject(ThemeManagerService);
  themalight = true;

  toggleTheme(): void {
    this.themalight = this.themeManagerService.switchTheme();
  }
}
