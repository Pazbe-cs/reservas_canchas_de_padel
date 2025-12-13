

Módulo de Reservas – Proceso Principal

 1. Descripción del Proceso

El proceso de Reservas de Canchas de Pádel permite:

- Validar si una cancha está disponible en una fecha y horario.
- Crear una reserva real.
- Cancelar una reserva existente.
- Obtener una reserva por su ID.

Este módulo cumple con todos los requisitos 

- ✔ Controller propio  
- ✔ Service con lógica de negocio  
- ✔ DTOs con validaciones  
- ✔ Métodos REST bien definidos  
- ✔ Pruebas reales en Postman  
- ✔ Documentación completa  

---

 2. Estructura creada
src/main/java/com/padel/backend/
├── service/dto/
│ ├── ReservaRequestDTO.java
│ └── ReservaResponseDTO.java
├── service/
│ └── ProcesoReservaService.java
├── web/rest/
│ └── ProcesoReservaResource.java
├── repository/
└── ReservaRepository.java


 3. DTOs Utilizados

 🟦 ReservaRequestDTO.java  
Incluye validaciones obligatorias (@NotNull, @NotBlank):

@NotNull private Long canchaId;
@NotBlank private String fecha;
@NotBlank private String horaInicio;
@NotBlank private String horaFin;

yaml
Copy code

---

 🟩 ReservaResponseDTO.java  
Devuelve datos limpios hacia el frontend:

private Long id;
private String fecha;
private String horaInicio;
private String horaFin;
private Long canchaId;
private Long usuarioId;

yaml
Copy code

---

📌 4. Lógica del Servicio (ProcesoReservaService)

### 🔹 validarDisponibilidad(request)
Retorna **true** o **false** si existe un choque de horarios.

### 🔹 crearReserva(request)
Guarda la reserva correctamente en la base de datos.

### 🔹 obtenerPorId(id)
Devuelve una reserva específica según su ID.

### 🔹 cancelarReserva(id)
Simula la cancelación de una reserva.

---

📌 5. Endpoints REST

🔵 1) Validar disponibilidad  
**POST /api/reservas-proceso/validar**

**Body (JSON):**
```json
{
  "canchaId": 1,
  "fecha": "2025-12-13",
  "horaInicio": "18:00",
  "horaFin": "19:00"
}



true



false

🔵 2) Crear reserva
POST /api/reservas-proceso

Body (JSON):

json

{
  "canchaId": 1,
  "fecha": "2025-12-13",
  "horaInicio": "18:00",
  "horaFin": "19:00"
}
Respuesta:

json

{
  "id": 5,
  "fecha": "2025-12-13",
  "horaInicio": "18:00",
  "horaFin": "19:00",
  "canchaId": 1,
  "usuarioId": null
}
🔵 3) Obtener reserva por ID
GET /api/reservas-proceso/{id}


GET http://localhost:8080/api/reservas-proceso/1
Respuesta:

JSON
{
  "id": 1,
  "fecha": "2025-11-24",
  "horaInicio": "01:02",
  "horaFin": "17:20",
  "estado": null,
  "usuarioId": null,
  "canchaId": null
}
🔵 4) Cancelar reserva
PUT /api/reservas-proceso/{id}/cancelar

Ejemplo:

PUT http://localhost:8080/api/reservas-proceso/1/cancelar

JSON
{
  "id": 1,
  "fecha": "2025-11-24",
  "horaInicio": "01:02",
  "horaFin": "17:20",
  "usuarioId": null,
  "canchaId": null
}
 6. Autenticación 
Todos los endpoints requieren Bearer Token.
Se debe iniciar sesión y copiar el token generado.

En Postman se debe agregar en Headers:


Authorization: Bearer TU_TOKEN
Content-Type: application/json
 7. Pruebas realizadas en Postman


✔ Validación de disponibilidad → true/false

✔ Crear reserva

✔ Obtener reserva por ID → 200 OK

✔ Cancelar reserva

✔ Todas autenticadas con Bearer Token

