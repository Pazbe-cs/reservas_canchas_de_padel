import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import HorarioResolve from './route/horario-routing-resolve.service';

const horarioRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/horario.component').then(m => m.HorarioComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/horario-detail.component').then(m => m.HorarioDetailComponent),
    resolve: {
      horario: HorarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/horario-update.component').then(m => m.HorarioUpdateComponent),
    resolve: {
      horario: HorarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/horario-update.component').then(m => m.HorarioUpdateComponent),
    resolve: {
      horario: HorarioResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default horarioRoute;
