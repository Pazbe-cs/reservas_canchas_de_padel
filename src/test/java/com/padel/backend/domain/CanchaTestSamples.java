package com.padel.backend.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CanchaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Cancha getCanchaSample1() {
        return new Cancha().id(1L).nombre("nombre1").tipo("tipo1");
    }

    public static Cancha getCanchaSample2() {
        return new Cancha().id(2L).nombre("nombre2").tipo("tipo2");
    }

    public static Cancha getCanchaRandomSampleGenerator() {
        return new Cancha().id(longCount.incrementAndGet()).nombre(UUID.randomUUID().toString()).tipo(UUID.randomUUID().toString());
    }
}
