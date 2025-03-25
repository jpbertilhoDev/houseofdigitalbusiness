// src/app/core/i18n/language.service.ts
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco'; // Atualizado para @jsverse/transloco
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
  public currentLanguage$: Observable<string> = this.currentLanguageSubject.asObservable();

  public readonly languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  ];

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const savedLang = localStorage.getItem('selectedLanguage');
    const browserLang = this.getBrowserLang();
    const defaultLang = savedLang || (browserLang && this.isLanguageAvailable(browserLang) ? browserLang : 'en');
    this.setLanguage(defaultLang);
  }

  private getBrowserLang(): string | null {
    const browserLang = navigator.language;
    return browserLang ? browserLang.split('-')[0].toLowerCase() : null;
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
    } else {
      console.warn(`Idioma ${langCode} não suportado. Usando fallback 'en'.`);
      this.setLanguage('en');
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public getLanguageByCode(code: string): Language | undefined {
    return this.languages.find((lang) => lang.code === code);
  }

  public getActiveLanguage(): Language {
    return this.getLanguageByCode(this.getCurrentLanguage()) || this.languages[0];
  }
}
