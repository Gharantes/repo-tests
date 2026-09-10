import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { BASE_PATH } from '@synergia-frontend/api';
import { environment } from './environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_PATH, useValue: environment.synergia },
    provideHttpClient(withXhr()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
  ],
};