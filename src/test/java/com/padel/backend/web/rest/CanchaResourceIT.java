package com.padel.backend.web.rest;

import static com.padel.backend.domain.CanchaAsserts.*;
import static com.padel.backend.web.rest.TestUtil.createUpdateProxyForBean;
import static com.padel.backend.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.padel.backend.IntegrationTest;
import com.padel.backend.domain.Cancha;
import com.padel.backend.repository.CanchaRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link CanchaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CanchaResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_TIPO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRECIO = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRECIO = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/canchas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CanchaRepository canchaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCanchaMockMvc;

    private Cancha cancha;

    private Cancha insertedCancha;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cancha createEntity() {
        return new Cancha().nombre(DEFAULT_NOMBRE).tipo(DEFAULT_TIPO).precio(DEFAULT_PRECIO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cancha createUpdatedEntity() {
        return new Cancha().nombre(UPDATED_NOMBRE).tipo(UPDATED_TIPO).precio(UPDATED_PRECIO);
    }

    @BeforeEach
    void initTest() {
        cancha = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCancha != null) {
            canchaRepository.delete(insertedCancha);
            insertedCancha = null;
        }
    }

    @Test
    @Transactional
    void createCancha() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Cancha
        var returnedCancha = om.readValue(
            restCanchaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Cancha.class
        );

        // Validate the Cancha in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCanchaUpdatableFieldsEquals(returnedCancha, getPersistedCancha(returnedCancha));

        insertedCancha = returnedCancha;
    }

    @Test
    @Transactional
    void createCanchaWithExistingId() throws Exception {
        // Create the Cancha with an existing ID
        cancha.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cancha.setNombre(null);

        // Create the Cancha, which fails.

        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecioIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cancha.setPrecio(null);

        // Create the Cancha, which fails.

        restCanchaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCanchas() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        // Get all the canchaList
        restCanchaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cancha.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO)))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(sameNumber(DEFAULT_PRECIO))));
    }

    @Test
    @Transactional
    void getCancha() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        // Get the cancha
        restCanchaMockMvc
            .perform(get(ENTITY_API_URL_ID, cancha.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cancha.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO))
            .andExpect(jsonPath("$.precio").value(sameNumber(DEFAULT_PRECIO)));
    }

    @Test
    @Transactional
    void getNonExistingCancha() throws Exception {
        // Get the cancha
        restCanchaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCancha() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cancha
        Cancha updatedCancha = canchaRepository.findById(cancha.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCancha are not directly saved in db
        em.detach(updatedCancha);
        updatedCancha.nombre(UPDATED_NOMBRE).tipo(UPDATED_TIPO).precio(UPDATED_PRECIO);

        restCanchaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCancha.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCancha))
            )
            .andExpect(status().isOk());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCanchaToMatchAllProperties(updatedCancha);
    }

    @Test
    @Transactional
    void putNonExistingCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(put(ENTITY_API_URL_ID, cancha.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cancha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCanchaWithPatch() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cancha using partial update
        Cancha partialUpdatedCancha = new Cancha();
        partialUpdatedCancha.setId(cancha.getId());

        partialUpdatedCancha.nombre(UPDATED_NOMBRE);

        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCancha.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCancha))
            )
            .andExpect(status().isOk());

        // Validate the Cancha in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCanchaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCancha, cancha), getPersistedCancha(cancha));
    }

    @Test
    @Transactional
    void fullUpdateCanchaWithPatch() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cancha using partial update
        Cancha partialUpdatedCancha = new Cancha();
        partialUpdatedCancha.setId(cancha.getId());

        partialUpdatedCancha.nombre(UPDATED_NOMBRE).tipo(UPDATED_TIPO).precio(UPDATED_PRECIO);

        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCancha.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCancha))
            )
            .andExpect(status().isOk());

        // Validate the Cancha in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCanchaUpdatableFieldsEquals(partialUpdatedCancha, getPersistedCancha(partialUpdatedCancha));
    }

    @Test
    @Transactional
    void patchNonExistingCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cancha.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cancha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cancha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCancha() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cancha.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCanchaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cancha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cancha in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCancha() throws Exception {
        // Initialize the database
        insertedCancha = canchaRepository.saveAndFlush(cancha);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the cancha
        restCanchaMockMvc
            .perform(delete(ENTITY_API_URL_ID, cancha.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return canchaRepository.count();
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

    protected Cancha getPersistedCancha(Cancha cancha) {
        return canchaRepository.findById(cancha.getId()).orElseThrow();
    }

    protected void assertPersistedCanchaToMatchAllProperties(Cancha expectedCancha) {
        assertCanchaAllPropertiesEquals(expectedCancha, getPersistedCancha(expectedCancha));
    }

    protected void assertPersistedCanchaToMatchUpdatableProperties(Cancha expectedCancha) {
        assertCanchaAllUpdatablePropertiesEquals(expectedCancha, getPersistedCancha(expectedCancha));
    }
}
