import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './routing/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { BASE_PATH } from '@synergia-frontend/api';
import { environment } from './environment/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_PATH, useValue: environment.synergia },
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
  ],
};
