# Proyecto Integración – Reservas y Pagos

## Proceso integrado
Gestión de Reservas con registro de pagos.

## Backend
- Spring Boot + JHipster
- Endpoints:
  - POST /api/reservas-proceso
  - POST /api/reservas-proceso/validar
  - PUT /api/reservas-proceso/{id}/pagar
  - GET /api/reservas-proceso
  - GET /api/pagos

## Frontend
- Angular
- Componente principal: proceso-principal
- Service: ProcesoReservaApiService

## Flujo
1. Se registra una reserva desde la UI.
2. El backend valida disponibilidad.
3. Se guarda la reserva en la base de datos.
4. Se registra el pago asociado.
5. El estado de la reserva se actualiza visualmente.

## Pruebas
- Se verificó el flujo completo usando Network del navegador.
- Se confirmó la persistencia en H2 Console.
