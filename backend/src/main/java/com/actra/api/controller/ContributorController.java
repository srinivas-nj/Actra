package com.actra.api.controller;

import com.actra.repository.TaskRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contributor")
public class ContributorController {

    private final TaskRepository taskRepository;

    public ContributorController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Map<String, Object>>> tasks() {
        List<Map<String, Object>> result = taskRepository.findAll().stream()
            .map(task -> {
                Map<String, Object> row = new HashMap<>();
                row.put("id", task.getTaskId());
                row.put("title", task.getTitle());
                row.put("reward", task.getReward());
                row.put("status", task.getStatus());
                return row;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
