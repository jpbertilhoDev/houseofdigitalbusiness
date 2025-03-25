// src/app/core/i18n/language.service.ts
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translocoService = inject(TranslocoService);

  private currentLanguageSubject = new BehaviorSubject<string>('en');
  public currentLanguage$: Observable<string> =
    this.currentLanguageSubject.asObservable();

  public languages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
    },
  ];

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Detectar idioma do navegador
    const browserLang = this.getBrowserLang();
    const defaultLang =
      browserLang && this.isLanguageAvailable(browserLang) ? browserLang : 'en';

    // Verificar se há um idioma salvo no localStorage
    const savedLang = localStorage.getItem('selectedLanguage');
    const initialLang = savedLang || defaultLang;

    this.setLanguage(initialLang);
  }

  private getBrowserLang(): string | null {
    const browserLang = navigator.language;
    return browserLang ? browserLang.split('-')[0] : null;
  }

  private isLanguageAvailable(langCode: string): boolean {
    return this.languages.some((lang) => lang.code === langCode);
  }

  public setLanguage(langCode: string): void {
    if (this.isLanguageAvailable(langCode)) {
      this.translocoService.setActiveLang(langCode);
      this.currentLanguageSubject.next(langCode);
      localStorage.setItem('selectedLanguage', langCode);
      document.documentElement.lang = langCode;

      // Adicionar classe ao body para estilização específica de idioma
      document.body.className = document.body.className
        .replace(/lang-\w+/g, '')
        .trim();
      document.body.classList.add(`lang-${langCode}`);
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public getLanguageByCode(code: string): Language | undefined {
    return this.languages.find((lang) => lang.code === code);
  }

  public getActiveLanguage(): Language {
    const current = this.getLanguageByCode(this.getCurrentLanguage());
    return current || this.languages[0];
  }
}
