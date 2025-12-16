package com.padel.backend.repository;

import com.padel.backend.domain.Reserva;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Spring Data JPA repository for the Reserva entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // 🔍 Validar si existe una reserva que se superpone en horario
    boolean existsByCanchaIdAndFechaAndHoraInicioLessThanEqualAndHoraFinGreaterThanEqual(
        Long canchaId,
        LocalDate fecha,
        LocalTime horaInicio,
        LocalTime horaFin
    );
}
