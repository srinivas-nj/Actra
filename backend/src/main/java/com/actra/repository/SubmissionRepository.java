package com.actra.repository;

import com.actra.model.SubmissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<SubmissionEntity, Long> {
}
