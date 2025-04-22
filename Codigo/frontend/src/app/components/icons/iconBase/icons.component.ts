import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss'
})
export class IconsComponent implements OnChanges{
  @Input() name!: string;
  @Input() size: string = '24';
  @Input() color: string = 'currentColor';
  @Input() background: string = 'none';
  @Input() stroke: string = '2';

  svgContent: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    this.loadIcon();
  }

  private loadIcon(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const iconPath = `assets/icons/${this.name}.svg`;

    fetch(iconPath)
      .then((response) => response.text())
      .then((svg) => {
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(
          svg.replace(/width=".*?"/, `width="${this.size}"`)
            .replace(/height=".*?"/, `height="${this.size}"`)
            .replace(/stroke=".*?"/, `stroke="${this.color}"`)
            .replace(/fill=".*?"/, `fill="${this.background}"`)
            .replace(/stroke-width=".*?"/, `stroke-width="${this.stroke}"`)
        );
      })
      .catch((error) => {
        console.error(`Erro ao carregar o ícone: ${this.name}`, error);
      });
  }
}
