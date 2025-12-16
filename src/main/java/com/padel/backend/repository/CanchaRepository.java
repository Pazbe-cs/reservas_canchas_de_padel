package com.padel.backend.repository;

import com.padel.backend.domain.Cancha;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Cancha entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CanchaRepository extends JpaRepository<Cancha, Long> {}
