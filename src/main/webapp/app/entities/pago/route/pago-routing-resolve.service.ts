import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPago } from '../pago.model';
import { PagoService } from '../service/pago.service';

const pagoResolve = (route: ActivatedRouteSnapshot): Observable<null | IPago> => {
  const id = route.params.id;
  if (id) {
    return inject(PagoService)
      .find(id)
      .pipe(
        mergeMap((pago: HttpResponse<IPago>) => {
          if (pago.body) {
            return of(pago.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default pagoResolve;
