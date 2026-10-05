package com.actra;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "jwt.secret=test-only-jwt-secret-that-is-at-least-32-bytes-long")
@AutoConfigureMockMvc
@Transactional
class ContributorFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void discoversTasksSubmitsDemoAndReadsPersistedSubmissionCount() throws Exception {
        mockMvc.perform(get("/api/contributor/tasks"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").isNotEmpty());

        String initialMetrics = mockMvc.perform(get("/api/metrics"))
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();
        JsonNode initialMetricsJson = objectMapper.readTree(initialMetrics);
        int previousCount = initialMetricsJson.get("freshSubmissions").asInt();

        mockMvc.perform(post("/api/submissions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "contributorName": "Integration Test Contributor",
                      "taskId": "task-301",
                      "location": "Local test environment",
                      "notes": "Persisted integration-test submission"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("Metadata saved"))
            .andExpect(jsonPath("$.message").value("Submission metadata saved. Video upload and admin review integration are not implemented."))
            .andExpect(jsonPath("$.id").isNotEmpty());

        mockMvc.perform(get("/api/metrics"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.freshSubmissions").value(previousCount + 1));
    }
}
