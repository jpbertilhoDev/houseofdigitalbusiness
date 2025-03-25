// src/app/core/i18n/transloco.config.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
  TRANSLOCO_TRANSPILER,
  DefaultTranspiler,
} from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export const translocoProviders: Provider[] = [
  {
    provide: TRANSLOCO_CONFIG,
    useValue: translocoConfig({
      availableLangs: ['en', 'pt', 'de'],
      defaultLang: 'en',
      reRenderOnLangChange: true,
      fallbackLang: 'en',
      prodMode: false, // Set to true in production
    }),
  },
  { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader },
  // Adicione este provedor que estava faltando
  { provide: TRANSLOCO_TRANSPILER, useClass: DefaultTranspiler },
];

// Exportamos o módulo para poder importá-lo nos componentes standalone
export const translocoImports = [TranslocoModule];
