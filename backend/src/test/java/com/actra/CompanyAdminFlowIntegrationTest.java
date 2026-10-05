package com.actra;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "jwt.secret=test-only-jwt-secret-that-is-at-least-32-bytes-long")
@AutoConfigureMockMvc
class CompanyAdminFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void browsesPersistedMarketplaceDatasetsAndAdminReviewQueue() throws Exception {
        mockMvc.perform(get("/api/company/datasets"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").isNotEmpty());

        mockMvc.perform(get("/api/admin/dashboard"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.queue").isArray())
            .andExpect(jsonPath("$.queue[0].title").isNotEmpty());
    }
}
