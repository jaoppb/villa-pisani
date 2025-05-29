import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccessTokenService } from '../services/accessToken.service';

export const HttpClientInterceptor: HttpInterceptorFn = (req, next) => {
  const accessTokenService = inject(AccessTokenService);
  let clonedRequest = req;
  const token = accessTokenService.AccessToken;

  if (!req.url.includes('https://')) {
    clonedRequest = req.clone({
      url: `${window.location.origin}/api/${req.url}`,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest);
};