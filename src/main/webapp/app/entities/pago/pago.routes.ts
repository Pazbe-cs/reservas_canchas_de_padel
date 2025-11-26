import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PagoResolve from './route/pago-routing-resolve.service';

const pagoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pago.component').then(m => m.PagoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pago-detail.component').then(m => m.PagoDetailComponent),
    resolve: {
      pago: PagoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pago-update.component').then(m => m.PagoUpdateComponent),
    resolve: {
      pago: PagoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pago-update.component').then(m => m.PagoUpdateComponent),
    resolve: {
      pago: PagoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pagoRoute;
