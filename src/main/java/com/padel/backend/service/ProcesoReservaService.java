package com.padel.backend.service;

import com.padel.backend.domain.Reserva;
import com.padel.backend.repository.ReservaRepository;
import com.padel.backend.repository.CanchaRepository;
import com.padel.backend.repository.UsuarioRepository;
import com.padel.backend.service.dto.ReservaRequestDTO;
import com.padel.backend.service.dto.ReservaResponseDTO;
import com.padel.backend.service.dto.ReservaValidacionDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ProcesoReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;

    public ProcesoReservaService(
        ReservaRepository reservaRepository,
        CanchaRepository canchaRepository,
        UsuarioRepository usuarioRepository
    ) {
        this.reservaRepository = reservaRepository;
        this.canchaRepository = canchaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // --------------------------------------------------------
    // VALIDACIÓN DE DISPONIBILIDAD
    // --------------------------------------------------------
    public boolean validarDisponibilidad(ReservaValidacionDTO req) {
        // Convertir Strings del DTO a LocalDate / LocalTime
        LocalDate fecha = LocalDate.parse(req.getFecha());           // ej: "2025-12-06"
        LocalTime horaInicio = LocalTime.parse(req.getHoraInicio()); // ej: "18:00"
        LocalTime horaFin = LocalTime.parse(req.getHoraFin());       // ej: "19:00"

        return !reservaRepository.existsByCanchaIdAndFechaAndHoraInicioLessThanEqualAndHoraFinGreaterThanEqual(
            req.getCanchaId(),
            fecha,
            horaInicio,
            horaFin
        );
    }

    // --------------------------------------------------------
    // REGISTRAR RESERVA
    // --------------------------------------------------------
    @Transactional
    public ReservaResponseDTO registrar(ReservaRequestDTO req) {
        boolean disponible = validarDisponibilidad(toValidacion(req));

        if (!disponible) {
            throw new RuntimeException("La cancha ya está reservada en ese horario.");
        }

        // Convertimos Strings del DTO a LocalDate / LocalTime
        LocalDate fecha = LocalDate.parse(req.getFecha());
        LocalTime horaInicio = LocalTime.parse(req.getHoraInicio());
        LocalTime horaFin = LocalTime.parse(req.getHoraFin());

        Reserva r = new Reserva();
        r.setFecha(fecha);
        r.setHoraInicio(horaInicio);
        r.setHoraFin(horaFin);

        // Relación con cancha y usuario
        r.setCancha(canchaRepository.getReferenceById(req.getCanchaId()));
        r.setUsuario(usuarioRepository.getReferenceById(req.getUsuarioId()));

        Reserva guardada = reservaRepository.save(r);

        return toResponse(guardada);
    }

    // --------------------------------------------------------
    // CANCELAR RESERVA (ejemplo sin campo estado en la entidad)
    // --------------------------------------------------------
    @Transactional
    public ReservaResponseDTO cancelar(Long id) {
        Reserva r = reservaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada: " + id));

        // Si tu entidad tuviera campo estado, acá iría: r.setEstado("Cancelada");
        // Como no lo tiene, simplemente devolvemos la reserva tal cual

        return toResponse(r);
    }

    // --------------------------------------------------------
    // OBTENER POR ID
    // --------------------------------------------------------
    @Transactional
    public ReservaResponseDTO obtener(Long id) {
        Reserva r = reservaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada: " + id));

        return toResponse(r);
    }

    // --------------------------------------------------------
    // LISTAR TODAS
    // --------------------------------------------------------
    @Transactional
    public List<ReservaResponseDTO> listar() {
        return reservaRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    // --------------------------------------------------------
    // MÉTODOS PRIVADOS PARA MAPEO DTO ↔ ENTIDAD
    // --------------------------------------------------------
    private ReservaValidacionDTO toValidacion(ReservaRequestDTO req) {
        ReservaValidacionDTO v = new ReservaValidacionDTO();
        v.setCanchaId(req.getCanchaId());
        v.setFecha(req.getFecha());
        v.setHoraInicio(req.getHoraInicio());
        v.setHoraFin(req.getHoraFin());
        return v;
    }

    private ReservaResponseDTO toResponse(Reserva r) {
        ReservaResponseDTO dto = new ReservaResponseDTO();

        dto.setId(r.getId());

        // Pasamos LocalDate / LocalTime a String en el DTO
        if (r.getFecha() != null) {
            dto.setFecha(r.getFecha().toString());
        }
        if (r.getHoraInicio() != null) {
            dto.setHoraInicio(r.getHoraInicio().toString());
        }
        if (r.getHoraFin() != null) {
            dto.setHoraFin(r.getHoraFin().toString());
        }

        // La entidad Reserva NO tiene estado ni createdDate, así que esos campos quedarán null
        // dto.setEstado(...);
        // dto.setCreadoEn(...);

        if (r.getUsuario() != null) {
            dto.setUsuarioId(r.getUsuario().getId());
        }
        if (r.getCancha() != null) {
            dto.setCanchaId(r.getCancha().getId());
        }

        return dto;
    }
}
