package com.padel.backend.domain;

import static com.padel.backend.domain.CanchaTestSamples.*;
import static com.padel.backend.domain.HorarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.padel.backend.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HorarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Horario.class);
        Horario horario1 = getHorarioSample1();
        Horario horario2 = new Horario();
        assertThat(horario1).isNotEqualTo(horario2);

        horario2.setId(horario1.getId());
        assertThat(horario1).isEqualTo(horario2);

        horario2 = getHorarioSample2();
        assertThat(horario1).isNotEqualTo(horario2);
    }

    @Test
    void canchaTest() {
        Horario horario = getHorarioRandomSampleGenerator();
        Cancha canchaBack = getCanchaRandomSampleGenerator();

        horario.setCancha(canchaBack);
        assertThat(horario.getCancha()).isEqualTo(canchaBack);

        horario.cancha(null);
        assertThat(horario.getCancha()).isNull();
    }
}
