package com.padel.backend.domain;

import static com.padel.backend.domain.CanchaTestSamples.*;
import static com.padel.backend.domain.PagoTestSamples.*;
import static com.padel.backend.domain.ReservaTestSamples.*;
import static com.padel.backend.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.padel.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReservaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reserva.class);
        Reserva reserva1 = getReservaSample1();
        Reserva reserva2 = new Reserva();
        assertThat(reserva1).isNotEqualTo(reserva2);

        reserva2.setId(reserva1.getId());
        assertThat(reserva1).isEqualTo(reserva2);

        reserva2 = getReservaSample2();
        assertThat(reserva1).isNotEqualTo(reserva2);
    }

    @Test
    void pagoTest() {
        Reserva reserva = getReservaRandomSampleGenerator();
        Pago pagoBack = getPagoRandomSampleGenerator();

        reserva.setPago(pagoBack);
        assertThat(reserva.getPago()).isEqualTo(pagoBack);

        reserva.pago(null);
        assertThat(reserva.getPago()).isNull();
    }

    @Test
    void usuarioTest() {
        Reserva reserva = getReservaRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        reserva.setUsuario(usuarioBack);
        assertThat(reserva.getUsuario()).isEqualTo(usuarioBack);

        reserva.usuario(null);
        assertThat(reserva.getUsuario()).isNull();
    }

    @Test
    void canchaTest() {
        Reserva reserva = getReservaRandomSampleGenerator();
        Cancha canchaBack = getCanchaRandomSampleGenerator();

        reserva.setCancha(canchaBack);
        assertThat(reserva.getCancha()).isEqualTo(canchaBack);

        reserva.cancha(null);
        assertThat(reserva.getCancha()).isNull();
    }
}
