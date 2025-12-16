package com.padel.backend.domain;

import static com.padel.backend.domain.PagoTestSamples.*;
import static com.padel.backend.domain.ReservaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.padel.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PagoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pago.class);
        Pago pago1 = getPagoSample1();
        Pago pago2 = new Pago();
        assertThat(pago1).isNotEqualTo(pago2);

        pago2.setId(pago1.getId());
        assertThat(pago1).isEqualTo(pago2);

        pago2 = getPagoSample2();
        assertThat(pago1).isNotEqualTo(pago2);
    }

    @Test
    void reservaTest() {
        Pago pago = getPagoRandomSampleGenerator();
        Reserva reservaBack = getReservaRandomSampleGenerator();

        pago.setReserva(reservaBack);
        assertThat(pago.getReserva()).isEqualTo(reservaBack);
        assertThat(reservaBack.getPago()).isEqualTo(pago);

        pago.reserva(null);
        assertThat(pago.getReserva()).isNull();
        assertThat(reservaBack.getPago()).isNull();
    }
}
