package com.padel.backend.web.rest;

import static com.padel.backend.domain.HorarioAsserts.*;
import static com.padel.backend.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.padel.backend.IntegrationTest;
import com.padel.backend.domain.Horario;
import com.padel.backend.repository.HorarioRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HorarioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HorarioResourceIT {

    private static final String DEFAULT_DIA = "AAAAAAAAAA";
    private static final String UPDATED_DIA = "BBBBBBBBBB";

    private static final LocalTime DEFAULT_HORA_INICIO = LocalTime.NOON;
    private static final LocalTime UPDATED_HORA_INICIO = LocalTime.MAX.withNano(0);

    private static final LocalTime DEFAULT_HORA_FIN = LocalTime.NOON;
    private static final LocalTime UPDATED_HORA_FIN = LocalTime.MAX.withNano(0);

    private static final String ENTITY_API_URL = "/api/horarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private HorarioRepository horarioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHorarioMockMvc;

    private Horario horario;

    private Horario insertedHorario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Horario createEntity() {
        return new Horario().dia(DEFAULT_DIA).horaInicio(DEFAULT_HORA_INICIO).horaFin(DEFAULT_HORA_FIN);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Horario createUpdatedEntity() {
        return new Horario().dia(UPDATED_DIA).horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);
    }

    @BeforeEach
    void initTest() {
        horario = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedHorario != null) {
            horarioRepository.delete(insertedHorario);
            insertedHorario = null;
        }
    }

    @Test
    @Transactional
    void createHorario() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Horario
        var returnedHorario = om.readValue(
            restHorarioMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Horario.class
        );

        // Validate the Horario in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertHorarioUpdatableFieldsEquals(returnedHorario, getPersistedHorario(returnedHorario));

        insertedHorario = returnedHorario;
    }

    @Test
    @Transactional
    void createHorarioWithExistingId() throws Exception {
        // Create the Horario with an existing ID
        horario.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHorarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
            .andExpect(status().isBadRequest());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDiaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        horario.setDia(null);

        // Create the Horario, which fails.

        restHorarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoraInicioIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        horario.setHoraInicio(null);

        // Create the Horario, which fails.

        restHorarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoraFinIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        horario.setHoraFin(null);

        // Create the Horario, which fails.

        restHorarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHorarios() throws Exception {
        // Initialize the database
        insertedHorario = horarioRepository.saveAndFlush(horario);

        // Get all the horarioList
        restHorarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(horario.getId().intValue())))
            .andExpect(jsonPath("$.[*].dia").value(hasItem(DEFAULT_DIA)))
            .andExpect(jsonPath("$.[*].horaInicio").value(hasItem(DEFAULT_HORA_INICIO.toString())))
            .andExpect(jsonPath("$.[*].horaFin").value(hasItem(DEFAULT_HORA_FIN.toString())));
    }

    @Test
    @Transactional
    void getHorario() throws Exception {
        // Initialize the database
        insertedHorario = horarioRepository.saveAndFlush(horario);

        // Get the horario
        restHorarioMockMvc
            .perform(get(ENTITY_API_URL_ID, horario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(horario.getId().intValue()))
            .andExpect(jsonPath("$.dia").value(DEFAULT_DIA))
            .andExpect(jsonPath("$.horaInicio").value(DEFAULT_HORA_INICIO.toString()))
            .andExpect(jsonPath("$.horaFin").value(DEFAULT_HORA_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingHorario() throws Exception {
        // Get the horario
        restHorarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHorario() throws Exception {
        // Initialize the database
        insertedHorario = horarioRepository.saveAndFlush(horario);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horario
        Horario updatedHorario = horarioRepository.findById(horario.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedHorario are not directly saved in db
        em.detach(updatedHorario);
        updatedHorario.dia(UPDATED_DIA).horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);

        restHorarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHorario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedHorario))
            )
            .andExpect(status().isOk());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedHorarioToMatchAllProperties(updatedHorario);
    }

    @Test
    @Transactional
    void putNonExistingHorario() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horario.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHorarioMockMvc
            .perform(put(ENTITY_API_URL_ID, horario.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
            .andExpect(status().isBadRequest());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHorario() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horario.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(horario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHorario() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horario.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHorarioWithPatch() throws Exception {
        // Initialize the database
        insertedHorario = horarioRepository.saveAndFlush(horario);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horario using partial update
        Horario partialUpdatedHorario = new Horario();
        partialUpdatedHorario.setId(horario.getId());

        partialUpdatedHorario.horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);

        restHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHorario.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHorario))
            )
            .andExpect(status().isOk());

        // Validate the Horario in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHorarioUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedHorario, horario), getPersistedHorario(horario));
    }

    @Test
    @Transactional
    void fullUpdateHorarioWithPatch() throws Exception {
        // Initialize the database
        insertedHorario = horarioRepository.saveAndFlush(horario);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horario using partial update
        Horario partialUpdatedHorario = new Horario();
        partialUpdatedHorario.setId(horario.getId());

        partialUpdatedHorario.dia(UPDATED_DIA).horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);

        restHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHorario.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHorario))
            )
            .andExpect(status().isOk());

        // Validate the Horario in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHorarioUpdatableFieldsEquals(partialUpdatedHorario, getPersistedHorario(partialUpdatedHorario));
    }

    @Test
    @Transactional
    void patchNonExistingHorario() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horario.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, horario.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(horario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHorario() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horario.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(horario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHorario() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horario.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(horario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Horario in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHorario() throws Exception {
        // Initialize the database
        insertedHorario = horarioRepository.saveAndFlush(horario);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the horario
        restHorarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, horario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return horarioRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Horario getPersistedHorario(Horario horario) {
        return horarioRepository.findById(horario.getId()).orElseThrow();
    }

    protected void assertPersistedHorarioToMatchAllProperties(Horario expectedHorario) {
        assertHorarioAllPropertiesEquals(expectedHorario, getPersistedHorario(expectedHorario));
    }

    protected void assertPersistedHorarioToMatchUpdatableProperties(Horario expectedHorario) {
        assertHorarioAllUpdatablePropertiesEquals(expectedHorario, getPersistedHorario(expectedHorario));
    }
}
