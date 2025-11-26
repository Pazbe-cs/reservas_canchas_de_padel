import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHorario } from '../horario.model';
import { HorarioService } from '../service/horario.service';

const horarioResolve = (route: ActivatedRouteSnapshot): Observable<null | IHorario> => {
  const id = route.params.id;
  if (id) {
    return inject(HorarioService)
      .find(id)
      .pipe(
        mergeMap((horario: HttpResponse<IHorario>) => {
          if (horario.body) {
            return of(horario.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default horarioResolve;
