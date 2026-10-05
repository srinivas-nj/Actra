package com.actra.repository;

import com.actra.model.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    long countByStatus(String status);
}
