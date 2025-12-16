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
 * - POST /api/reservas-proceso          -> crear reserva
 * - POST /api/reservas-proceso/validar  -> validar disponibilidad
 * - PUT  /api/reservas-proceso/{id}/cancelar -> cancelar reserva
 * - GET  /api/reservas-proceso/{id}     -> obtener reserva por id
 * - GET  /api/reservas-proceso          -> listar reservas
 */
@RestController
@RequestMapping("/api/reservas-proceso")
public class ProcesoReservaResource {

    private final ProcesoReservaService service;

    public ProcesoReservaResource(ProcesoReservaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(@Valid @RequestBody ReservaRequestDTO req) {
        ReservaResponseDTO dto = service.registrar(req);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/validar")
    public ResponseEntity<Boolean> validar(@Valid @RequestBody ReservaValidacionDTO req) {
        boolean disponible = service.validarDisponibilidad(req);
        return ResponseEntity.ok(disponible);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<ReservaResponseDTO> cancelar(@PathVariable Long id) {
        ReservaResponseDTO dto = service.cancelar(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> obtener(@PathVariable Long id) {
        ReservaResponseDTO dto = service.obtener(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listar() {
        List<ReservaResponseDTO> lista = service.listar();
        return ResponseEntity.ok(lista);
    }
}
