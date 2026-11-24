import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { BASE_PATH } from '@synergia-frontend/api';
import { environment } from './environment/environment';
import { autenticacaoInterceptor } from '@synergia-frontend/services';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_PATH, useValue: environment.synergia },
    provideHttpClient(withXhr(), withInterceptors([autenticacaoInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
  ],
};