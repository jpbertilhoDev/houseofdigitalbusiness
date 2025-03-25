// src/app/core/i18n/transloco.config.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Provider } from '@angular/core';
import {
  TranslocoModule,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoLoader,
  Translation,
} from '@jsverse/transloco';
import { Observable } from 'rxjs';

// Loader personalizado para carregar traduções via HTTP
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  getTranslation(lang: string): Observable<any> {
    console.log('ESTOU AUQI');
    console.log(lang);
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

// Configuração do Transloco com boas práticas
export const translocoProviders: Provider[] = [
  {
    provide: TRANSLOCO_CONFIG,
    useValue: translocoConfig({
      availableLangs: ['en', 'pt', 'de'], // Idiomas disponíveis
      defaultLang: 'en', // Idioma padrão
      reRenderOnLangChange: true, // Re-renderiza ao mudar idioma
      fallbackLang: 'en', // Idioma de fallback
      prodMode: false, // Desativado em desenvolvimento
      missingHandler: {
        // Tratamento de chaves ausentes
        useFallbackTranslation: true, // Usa o idioma de fallback
        logMissingKey: true, // Loga chaves ausentes no console
      },
    }),
  },
  // { provide: TranslocoLoader, useClass: TranslocoHttpLoader },
];

// Exportação do módulo para uso em standalone components
export const translocoImports = [TranslocoModule];
