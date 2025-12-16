import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICancha } from '../cancha.model';
import { CanchaService } from '../service/cancha.service';

const canchaResolve = (route: ActivatedRouteSnapshot): Observable<null | ICancha> => {
  const id = route.params.id;
  if (id) {
    return inject(CanchaService)
      .find(id)
      .pipe(
        mergeMap((cancha: HttpResponse<ICancha>) => {
          if (cancha.body) {
            return of(cancha.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default canchaResolve;
