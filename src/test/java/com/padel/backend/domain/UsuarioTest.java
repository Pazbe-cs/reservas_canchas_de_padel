package com.padel.backend.domain;

import static com.padel.backend.domain.ReservaTestSamples.*;
import static com.padel.backend.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.padel.backend.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Usuario.class);
        Usuario usuario1 = getUsuarioSample1();
        Usuario usuario2 = new Usuario();
        assertThat(usuario1).isNotEqualTo(usuario2);

        usuario2.setId(usuario1.getId());
        assertThat(usuario1).isEqualTo(usuario2);

        usuario2 = getUsuarioSample2();
        assertThat(usuario1).isNotEqualTo(usuario2);
    }

    @Test
    void reservasTest() {
        Usuario usuario = getUsuarioRandomSampleGenerator();
        Reserva reservaBack = getReservaRandomSampleGenerator();

        usuario.addReservas(reservaBack);
        assertThat(usuario.getReservas()).containsOnly(reservaBack);
        assertThat(reservaBack.getUsuario()).isEqualTo(usuario);

        usuario.removeReservas(reservaBack);
        assertThat(usuario.getReservas()).doesNotContain(reservaBack);
        assertThat(reservaBack.getUsuario()).isNull();

        usuario.reservas(new HashSet<>(Set.of(reservaBack)));
        assertThat(usuario.getReservas()).containsOnly(reservaBack);
        assertThat(reservaBack.getUsuario()).isEqualTo(usuario);

        usuario.setReservas(new HashSet<>());
        assertThat(usuario.getReservas()).doesNotContain(reservaBack);
        assertThat(reservaBack.getUsuario()).isNull();
    }
}
