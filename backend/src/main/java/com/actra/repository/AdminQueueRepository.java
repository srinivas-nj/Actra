package com.actra.repository;

import com.actra.model.AdminQueueEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminQueueRepository extends JpaRepository<AdminQueueEntity, Long> {
}
