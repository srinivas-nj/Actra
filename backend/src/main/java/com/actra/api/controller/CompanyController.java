package com.actra.api.controller;

import com.actra.model.DatasetEntity;
import com.actra.repository.DatasetRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final DatasetRepository datasetRepository;

    public CompanyController(DatasetRepository datasetRepository) {
        this.datasetRepository = datasetRepository;
    }

    @GetMapping("/datasets")
    public ResponseEntity<List<Map<String, Object>>> datasets() {
        List<Map<String, Object>> result = datasetRepository.findAll().stream()
            .map(dataset -> {
                Map<String, Object> row = new HashMap<>();
                row.put("id", dataset.getSlug());
                row.put("name", dataset.getName());
                row.put("focus", dataset.getFocus());
                row.put("qualityScore", dataset.getQualityScore());
                return row;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
