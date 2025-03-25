// // src/app/core/providers/translation.provider.ts
// import { Provider } from '@angular/core';
// import {
//   TranslateModule,
//   TranslateLoader,
//   TranslateStore,
//   TranslateService,
// } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HttpClient } from '@angular/common/http';

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// export const TRANSLATION_PROVIDERS: Provider[] = [
//   TranslateStore,
//   TranslateService,
//   {
//     provide: TranslateLoader,
//     useFactory: HttpLoaderFactory,
//     deps: [HttpClient],
//   },
// ];
