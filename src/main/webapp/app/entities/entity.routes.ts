import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'usuario',
    data: { pageTitle: 'Usuarios' },
    loadChildren: () => import('./usuario/usuario.routes'),
  },
  {
    path: 'cancha',
    data: { pageTitle: 'Canchas' },
    loadChildren: () => import('./cancha/cancha.routes'),
  },
  {
    path: 'horario',
    data: { pageTitle: 'Horarios' },
    loadChildren: () => import('./horario/horario.routes'),
  },
  {
    path: 'reserva',
    data: { pageTitle: 'Reservas' },
    loadChildren: () => import('./reserva/reserva.routes'),
  },
  {
    path: 'pago',
    data: { pageTitle: 'Pagos' },
    loadChildren: () => import('./pago/pago.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
