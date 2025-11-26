package com.padel.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cancha.
 */
@Entity
@Table(name = "cancha")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Cancha implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "tipo")
    private String tipo;

    @NotNull
    @Column(name = "precio", precision = 21, scale = 2, nullable = false)
    private BigDecimal precio;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cancha")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "pago", "usuario", "cancha" }, allowSetters = true)
    private Set<Reserva> reservas = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cancha")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cancha" }, allowSetters = true)
    private Set<Horario> horarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cancha id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Cancha nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTipo() {
        return this.tipo;
    }

    public Cancha tipo(String tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getPrecio() {
        return this.precio;
    }

    public Cancha precio(BigDecimal precio) {
        this.setPrecio(precio);
        return this;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Set<Reserva> getReservas() {
        return this.reservas;
    }

    public void setReservas(Set<Reserva> reservas) {
        if (this.reservas != null) {
            this.reservas.forEach(i -> i.setCancha(null));
        }
        if (reservas != null) {
            reservas.forEach(i -> i.setCancha(this));
        }
        this.reservas = reservas;
    }

    public Cancha reservas(Set<Reserva> reservas) {
        this.setReservas(reservas);
        return this;
    }

    public Cancha addReservas(Reserva reserva) {
        this.reservas.add(reserva);
        reserva.setCancha(this);
        return this;
    }

    public Cancha removeReservas(Reserva reserva) {
        this.reservas.remove(reserva);
        reserva.setCancha(null);
        return this;
    }

    public Set<Horario> getHorarios() {
        return this.horarios;
    }

    public void setHorarios(Set<Horario> horarios) {
        if (this.horarios != null) {
            this.horarios.forEach(i -> i.setCancha(null));
        }
        if (horarios != null) {
            horarios.forEach(i -> i.setCancha(this));
        }
        this.horarios = horarios;
    }

    public Cancha horarios(Set<Horario> horarios) {
        this.setHorarios(horarios);
        return this;
    }

    public Cancha addHorarios(Horario horario) {
        this.horarios.add(horario);
        horario.setCancha(this);
        return this;
    }

    public Cancha removeHorarios(Horario horario) {
        this.horarios.remove(horario);
        horario.setCancha(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cancha)) {
            return false;
        }
        return getId() != null && getId().equals(((Cancha) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cancha{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", precio=" + getPrecio() +
            "}";
    }
}
