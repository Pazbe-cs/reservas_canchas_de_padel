import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CanchaResolve from './route/cancha-routing-resolve.service';

const canchaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/cancha.component').then(m => m.CanchaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/cancha-detail.component').then(m => m.CanchaDetailComponent),
    resolve: {
      cancha: CanchaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/cancha-update.component').then(m => m.CanchaUpdateComponent),
    resolve: {
      cancha: CanchaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/cancha-update.component').then(m => m.CanchaUpdateComponent),
    resolve: {
      cancha: CanchaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default canchaRoute;
