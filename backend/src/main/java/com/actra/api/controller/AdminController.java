package com.actra.api.controller;

import com.actra.repository.AdminQueueRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminQueueRepository adminQueueRepository;

    public AdminController(AdminQueueRepository adminQueueRepository) {
        this.adminQueueRepository = adminQueueRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        List<Map<String, Object>> queue = adminQueueRepository.findAll().stream()
            .map(item -> {
                Map<String, Object> row = new HashMap<>();
                row.put("id", item.getQueueId());
                row.put("title", item.getTitle());
                row.put("status", item.getStatus());
                return row;
            })
            .collect(Collectors.toList());

        long submissionsInReview = adminQueueRepository.findAll().stream()
            .filter(item -> "Needs review".equalsIgnoreCase(item.getStatus()))
            .count();

        return ResponseEntity.ok(Map.of(
            "submissionsInReview", submissionsInReview,
            "approvedThisWeek", 224,
            "complianceRisk", 1.4,
            "queue", queue
        ));
    }
}
