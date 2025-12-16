import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ReservaResolve from './route/reserva-routing-resolve.service';

const reservaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/reserva.component').then(m => m.ReservaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/reserva-detail.component').then(m => m.ReservaDetailComponent),
    resolve: {
      reserva: ReservaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/reserva-update.component').then(m => m.ReservaUpdateComponent),
    resolve: {
      reserva: ReservaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/reserva-update.component').then(m => m.ReservaUpdateComponent),
    resolve: {
      reserva: ReservaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default reservaRoute;
