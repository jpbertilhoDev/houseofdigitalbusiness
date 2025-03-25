// // src/app/core/i18n/translation.config.ts
// import { Provider } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// // Função para criar o loader de tradução
// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// // Configuração para importar nos componentes standalone
// export const TRANSLATE_IMPORTS = [
//   TranslateModule
// ];

// // Provedores para a configuração de tradução
// export const TRANSLATE_PROVIDERS: Provider[] = [
//   {
//     provide: 'TRANSLATION_CONFIG',
//     useValue: {
//       defaultLang: 'en',
//       supportedLangs: ['en', 'pt', 'de']
//     }
//   }
// ];
