package com.padel.backend.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class HorarioTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Horario getHorarioSample1() {
        return new Horario().id(1L).dia("dia1");
    }

    public static Horario getHorarioSample2() {
        return new Horario().id(2L).dia("dia2");
    }

    public static Horario getHorarioRandomSampleGenerator() {
        return new Horario().id(longCount.incrementAndGet()).dia(UUID.randomUUID().toString());
    }
}
