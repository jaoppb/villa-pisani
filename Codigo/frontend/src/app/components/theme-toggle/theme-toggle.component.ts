import { Component, inject} from '@angular/core';
import { ThemeManagerService } from '../../services/theme-manager.service';
import { IconsComponent } from '../icons/iconBase/icons.component';

@Component({
  selector: 'app-theme-toggle',
  imports: [IconsComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent{
  private readonly themeManagerService = inject(ThemeManagerService);
  themalight = this.themeManagerService.themalight;

  toggleTheme(): void {
    this.themalight = this.themeManagerService.switchTheme();
  }
}
