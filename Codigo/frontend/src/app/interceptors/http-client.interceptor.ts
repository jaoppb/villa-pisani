import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const HttpClientInterceptor: HttpInterceptorFn = (req, next) => {
  let clonedRequest = req;
  const token = localStorage.getItem('authToken');

  if (!req.url.includes('https://')) {
    clonedRequest = req.clone({
      url: `${environment.apiURL}/${req.url}`,
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest);
};