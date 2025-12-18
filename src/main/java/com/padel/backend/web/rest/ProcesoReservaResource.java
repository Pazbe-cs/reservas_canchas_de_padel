package com.padel.backend.web.rest;

import com.padel.backend.service.ProcesoReservaService;
import com.padel.backend.service.dto.ReservaRequestDTO;
import com.padel.backend.service.dto.ReservaResponseDTO;
import com.padel.backend.service.dto.ReservaValidacionDTO;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Recurso REST para el PROCESO de Reservas.
 * Endpoints:
 * - POST /api/reservas-proceso              -> crear reserva
 * - POST /api/reservas-proceso/validar      -> validar disponibilidad
 * - PUT  /api/reservas-proceso/{id}/cancelar-> cancelar reserva
 * - PUT  /api/reservas-proceso/{id}/pagar   -> marcar reserva como pagada
 * - GET  /api/reservas-proceso/{id}         -> obtener reserva por id
 * - GET  /api/reservas-proceso              -> listar reservas
 */
@RestController
@RequestMapping("/api/reservas-proceso")
public class ProcesoReservaResource {

    private final ProcesoReservaService service;

    public ProcesoReservaResource(ProcesoReservaService service) {
        this.service = service;
    }

    // ---------------------------------------------------------
    // CREAR RESERVA
    // ---------------------------------------------------------
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(@Valid @RequestBody ReservaRequestDTO req) {
        ReservaResponseDTO dto = service.registrar(req);
        return ResponseEntity.ok(dto);
    }

    // ---------------------------------------------------------
    // VALIDAR DISPONIBILIDAD
    // ---------------------------------------------------------
    @PostMapping("/validar")
    public ResponseEntity<Boolean> validar(@Valid @RequestBody ReservaValidacionDTO req) {
        boolean disponible = service.validarDisponibilidad(req);
        return ResponseEntity.ok(disponible);
    }

    // ---------------------------------------------------------
    // CANCELAR RESERVA
    // ---------------------------------------------------------
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ReservaResponseDTO> cancelar(@PathVariable Long id) {
        ReservaResponseDTO dto = service.cancelar(id);
        return ResponseEntity.ok(dto);
    }

    // ---------------------------------------------------------
    // ✅ MARCAR COMO PAGADA
    // ---------------------------------------------------------
    @PutMapping("/{id}/pagar")
    public ResponseEntity<ReservaResponseDTO> pagar(@PathVariable Long id) {
        ReservaResponseDTO dto = service.pagar(id);
        return ResponseEntity.ok(dto);
    }

    // ---------------------------------------------------------
    // OBTENER POR ID
    // ---------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> obtener(@PathVariable Long id) {
        ReservaResponseDTO dto = service.obtener(id);
        return ResponseEntity.ok(dto);
    }

    // ---------------------------------------------------------
    // LISTAR TODAS
    // ---------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listar() {
        List<ReservaResponseDTO> lista = service.listar();
        return ResponseEntity.ok(lista);
    }
}
