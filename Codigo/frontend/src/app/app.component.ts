import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeManagerService } from './services/theme-manager.service';
import { MetaData } from './services/meta-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [ThemeManagerService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'frontend';
  constructor(
    private themeManagerService: ThemeManagerService,
    private metadataService: MetaData,
  ) {}
  
  ngOnInit(): void {
    this.themeManagerService.ngOnInit();
    this.metadataService.ngOnInit();
  }
}
