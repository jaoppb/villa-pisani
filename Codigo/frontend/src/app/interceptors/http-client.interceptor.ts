import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { AccessTokenService } from '../services/accessToken.service';

export const HttpClientInterceptor: HttpInterceptorFn = (req, next) => {
  const accessTokenService = inject(AccessTokenService);
  let clonedRequest = req;
  const token = accessTokenService.AccessToken;

  if (!req.url.includes('https://')) {
    const url = (environment.apiURL ?? `${window.location.origin}/api`) + `/${req.url}`;
	
	clonedRequest = req.clone({
      url,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest);
};