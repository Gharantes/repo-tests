import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { SessionService } from './session.service';

/**
 * Manda o token da sessão em `Authorization: Bearer ...` em toda chamada para o
 * backend do Synergia. Só para o backend: o token nunca vai para outro endereço.
 */
export const autenticacaoInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionService).getToken();
  const basePath = inject(BASE_PATH, { optional: true });
  const api = Array.isArray(basePath) ? basePath[0] : basePath;

  if (!token || !api || !req.url.startsWith(api) || req.headers.has('Authorization')) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
