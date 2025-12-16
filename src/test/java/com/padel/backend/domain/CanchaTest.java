package com.padel.backend.domain;

import static com.padel.backend.domain.CanchaTestSamples.*;
import static com.padel.backend.domain.HorarioTestSamples.*;
import static com.padel.backend.domain.ReservaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.padel.backend.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CanchaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cancha.class);
        Cancha cancha1 = getCanchaSample1();
        Cancha cancha2 = new Cancha();
        assertThat(cancha1).isNotEqualTo(cancha2);

        cancha2.setId(cancha1.getId());
        assertThat(cancha1).isEqualTo(cancha2);

        cancha2 = getCanchaSample2();
        assertThat(cancha1).isNotEqualTo(cancha2);
    }

    @Test
    void reservasTest() {
        Cancha cancha = getCanchaRandomSampleGenerator();
        Reserva reservaBack = getReservaRandomSampleGenerator();

        cancha.addReservas(reservaBack);
        assertThat(cancha.getReservas()).containsOnly(reservaBack);
        assertThat(reservaBack.getCancha()).isEqualTo(cancha);

        cancha.removeReservas(reservaBack);
        assertThat(cancha.getReservas()).doesNotContain(reservaBack);
        assertThat(reservaBack.getCancha()).isNull();

        cancha.reservas(new HashSet<>(Set.of(reservaBack)));
        assertThat(cancha.getReservas()).containsOnly(reservaBack);
        assertThat(reservaBack.getCancha()).isEqualTo(cancha);

        cancha.setReservas(new HashSet<>());
        assertThat(cancha.getReservas()).doesNotContain(reservaBack);
        assertThat(reservaBack.getCancha()).isNull();
    }

    @Test
    void horariosTest() {
        Cancha cancha = getCanchaRandomSampleGenerator();
        Horario horarioBack = getHorarioRandomSampleGenerator();

        cancha.addHorarios(horarioBack);
        assertThat(cancha.getHorarios()).containsOnly(horarioBack);
        assertThat(horarioBack.getCancha()).isEqualTo(cancha);

        cancha.removeHorarios(horarioBack);
        assertThat(cancha.getHorarios()).doesNotContain(horarioBack);
        assertThat(horarioBack.getCancha()).isNull();

        cancha.horarios(new HashSet<>(Set.of(horarioBack)));
        assertThat(cancha.getHorarios()).containsOnly(horarioBack);
        assertThat(horarioBack.getCancha()).isEqualTo(cancha);

        cancha.setHorarios(new HashSet<>());
        assertThat(cancha.getHorarios()).doesNotContain(horarioBack);
        assertThat(horarioBack.getCancha()).isNull();
    }
}
