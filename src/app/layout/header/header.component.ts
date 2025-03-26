// src/app/layout/header/header.component.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { TranslocoModule } from '@ngneat/transloco';
import { LanguageSelectorComponent } from '../../core/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '../../core/components/theme-toggle/theme-toggle.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    LanguageSelectorComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isScrolled = false;
  menuActive = false;
  ngOnInit(): void {}

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
    document.body.style.overflow = this.menuActive ? 'hidden' : '';
  }
}
