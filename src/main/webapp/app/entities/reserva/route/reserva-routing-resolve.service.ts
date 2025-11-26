import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IReserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';

const reservaResolve = (route: ActivatedRouteSnapshot): Observable<null | IReserva> => {
  const id = route.params.id;
  if (id) {
    return inject(ReservaService)
      .find(id)
      .pipe(
        mergeMap((reserva: HttpResponse<IReserva>) => {
          if (reserva.body) {
            return of(reserva.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default reservaResolve;
