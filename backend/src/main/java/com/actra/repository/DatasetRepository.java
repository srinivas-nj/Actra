package com.actra.repository;

import com.actra.model.DatasetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatasetRepository extends JpaRepository<DatasetEntity, Long> {
    long countByStatus(String status);
}
