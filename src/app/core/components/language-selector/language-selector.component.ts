// src/app/core/components/language-selector/language-selector.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguageService, Language } from '../../i18n/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="language-selector">
      <button class="language-toggle" (click)="toggleDropdown($event)">
        <span class="flag">{{ activeLanguage.flag }}</span>
        <span class="language-code">{{ activeLanguage.code.toUpperCase() }}</span>
        <span class="arrow">▼</span>
      </button>

      <div class="language-dropdown" *ngIf="isDropdownOpen">
        <div
          *ngFor="let lang of languages"
          class="language-option"
          [class.active]="lang.code === activeLanguage.code"
          (click)="selectLanguage(lang, $event)"
        >
          <span class="flag">{{ lang.flag }}</span>
          <div class="language-info">
            <span class="language-native">{{ lang.nativeName }}</span>
            <span class="language-name">{{ lang.name }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .language-selector {
      position: relative;
      display: inline-block;
    }

    .language-toggle {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 12px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      cursor: pointer;
      color: var(--nav-text, white);
      transition: all 0.3s ease;
    }

    .language-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    .flag {
      font-size: 16px;
    }

    .language-code {
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .arrow {
      font-size: 10px;
      margin-left: 5px;
      transition: transform 0.3s ease;
    }

    .language-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      min-width: 180px;
      z-index: 1000;
      overflow: hidden;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #333;
    }

    .language-option:hover {
      background-color: #f5f5f5;
    }

    .language-option.active {
      background-color: #e0e0e0;
      position: relative;
    }

    .language-option.active::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background-color: var(--primary-color, #0088cc);
    }

    .language-info {
      display: flex;
      flex-direction: column;
    }

    .language-native {
      font-weight: 500;
      font-size: 14px;
    }

    .language-name {
      font-size: 12px;
      opacity: 0.7;
    }

    @media (max-width: 768px) {
      .language-toggle {
        padding: 6px 10px;
      }

      .language-code {
        display: none;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  private languageService = inject(LanguageService);

  activeLanguage!: Language;
  languages: Language[] = [];
  isDropdownOpen = false;

  ngOnInit(): void {
    this.languages = this.languageService.languages;
    this.activeLanguage = this.languageService.getActiveLanguage();

    this.languageService.currentLanguage$.subscribe(langCode => {
      const lang = this.languageService.getLanguageByCode(langCode);
      if (lang) {
        this.activeLanguage = lang;
      }
    });

    // Fechar dropdown quando clicar fora
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectLanguage(language: Language, event: Event): void {
    event.stopPropagation();
    this.languageService.setLanguage(language.code);
    this.isDropdownOpen = false;
  }

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      this.isDropdownOpen = false;
    }
  }
}
