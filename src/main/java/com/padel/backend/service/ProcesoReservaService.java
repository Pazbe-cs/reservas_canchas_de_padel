package com.padel.backend.service;

import com.padel.backend.domain.Pago;
import com.padel.backend.domain.Reserva;
import com.padel.backend.repository.CanchaRepository;
import com.padel.backend.repository.PagoRepository;
import com.padel.backend.repository.ReservaRepository;
import com.padel.backend.repository.UsuarioRepository;
import com.padel.backend.service.dto.ReservaRequestDTO;
import com.padel.backend.service.dto.ReservaResponseDTO;
import com.padel.backend.service.dto.ReservaValidacionDTO;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProcesoReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PagoRepository pagoRepository;

    public ProcesoReservaService(
        ReservaRepository reservaRepository,
        CanchaRepository canchaRepository,
        UsuarioRepository usuarioRepository,
        PagoRepository pagoRepository
    ) {
        this.reservaRepository = reservaRepository;
        this.canchaRepository = canchaRepository;
        this.usuarioRepository = usuarioRepository;
        this.pagoRepository = pagoRepository;
    }

    // --------------------------------------------------------
    // VALIDACIÓN DE DISPONIBILIDAD
    // --------------------------------------------------------
    public boolean validarDisponibilidad(ReservaValidacionDTO req) {
        LocalDate fecha = LocalDate.parse(req.getFecha());
        LocalTime horaInicio = LocalTime.parse(req.getHoraInicio());
        LocalTime horaFin = LocalTime.parse(req.getHoraFin());

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

        LocalDate fecha = LocalDate.parse(req.getFecha());
        LocalTime horaInicio = LocalTime.parse(req.getHoraInicio());
        LocalTime horaFin = LocalTime.parse(req.getHoraFin());

        Reserva r = new Reserva();
        r.setFecha(fecha);
        r.setHoraInicio(horaInicio);
        r.setHoraFin(horaFin);

        r.setCancha(canchaRepository.getReferenceById(req.getCanchaId()));
        r.setUsuario(usuarioRepository.getReferenceById(req.getUsuarioId()));

        Reserva guardada = reservaRepository.save(r);
        return toResponse(guardada);
    }

    // --------------------------------------------------------
    // CANCELAR RESERVA
    // --------------------------------------------------------
    @Transactional
    public ReservaResponseDTO cancelar(Long id) {
        Reserva r = reservaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada: " + id));

        return toResponse(r);
    }

    // --------------------------------------------------------
    // ✅ PAGAR RESERVA (CREA PAGO + LO ASOCIA)
    // --------------------------------------------------------
    @Transactional
    public ReservaResponseDTO pagar(Long reservaId) {
        Reserva r = reservaRepository.findById(reservaId)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada: " + reservaId));

        // Si ya tiene pago, devolvemos como está (evita duplicados)
        if (r.getPago() != null) {
            return toResponse(r);
        }

        Pago p = new Pago();
        p.setFecha(Instant.now());

        // 👇 monto fijo por ahora (después lo hacemos dinámico con DTO si querés)
        p.setMonto(new BigDecimal("0.00"));

        // Relación 1-1 (por tu Pago.java esto setea también r.setPago(this))
        p.setReserva(r);

        pagoRepository.save(p);
        Reserva guardada = reservaRepository.save(r);

        return toResponse(guardada);
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
    // MAPEOS DTO
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

        if (r.getFecha() != null) dto.setFecha(r.getFecha().toString());
        if (r.getHoraInicio() != null) dto.setHoraInicio(r.getHoraInicio().toString());
        if (r.getHoraFin() != null) dto.setHoraFin(r.getHoraFin().toString());

        if (r.getUsuario() != null) dto.setUsuarioId(r.getUsuario().getId());
        if (r.getCancha() != null) dto.setCanchaId(r.getCancha().getId());

        // ✅ CLAVE: mandar pagoId al front
        if (r.getPago() != null) {
            dto.setPagoId(r.getPago().getId());
        }

        return dto;
    }
}
