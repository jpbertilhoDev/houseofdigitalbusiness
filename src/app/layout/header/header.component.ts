// src/app/layout/header/header.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
// import { TranslocoModule } from '@ngneat/transloco';
import { LanguageSelectorComponent } from '../../core/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '../../core/components/theme-toggle/theme-toggle.component';
import { TranslocoModule } from '@jsverse/transloco';
import { filter } from 'rxjs/operators';

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
export class HeaderComponent implements OnInit {
  isScrolled = false;
  menuActive = false;
  lastScrollTop = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Checar se já temos scroll ao iniciar a página
    this.checkScroll();

    // Fechar menu ao navegar
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.menuActive) {
          this.closeMenu();
        }
      });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    // Alterado para obter melhor resposta em dispositivos móveis
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // O header se torna com fundo quando o scroll passa de 20px
    this.isScrolled = scrollPosition > 20;
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
    document.body.style.overflow = this.menuActive ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuActive = false;
    document.body.style.overflow = '';
  }
}
