package com.padel.backend.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UsuarioTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Usuario getUsuarioSample1() {
        return new Usuario().id(1L).nombre("nombre1").email("email1").telefono("telefono1");
    }

    public static Usuario getUsuarioSample2() {
        return new Usuario().id(2L).nombre("nombre2").email("email2").telefono("telefono2");
    }

    public static Usuario getUsuarioRandomSampleGenerator() {
        return new Usuario()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .telefono(UUID.randomUUID().toString());
    }
}
