package com.actra.repository;

import com.actra.model.CompanyRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRequestRepository extends JpaRepository<CompanyRequestEntity, Long> {
}
