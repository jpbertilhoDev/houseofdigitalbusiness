// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import {
  TranslocoHttpLoader,
} from './core/i18n/transloco.config';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideTransloco({
      config: {
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
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
