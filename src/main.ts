import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
// import { importProvidersFrom } from '@angular/core';

// import { TranslateModule } from '@ngx-translate/core';
// import { TRANSLATION_PROVIDERS } from './app/core/providers/translation.provider';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(), provideHttpClient(), provideTransloco({
        config: { 
          availableLangs: ['en', 'pt', 'de'],
          defaultLang: 'en',
          // Remove this option if your application doesn't support changing language in runtime.
          reRenderOnLangChange: true,
          prodMode: !isDevMode(),
        },
        loader: TranslocoHttpLoader
      }),
    // importProvidersFrom(TranslateModule),
    // ...TRANSLATION_PROVIDERS, // Aqui garantimos que TranslateStore está incluído
  ],
}).catch((err) => console.error(err));
