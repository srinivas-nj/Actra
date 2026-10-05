package com.actra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "company_requests")
public class CompanyRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String requestId;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private int progress;

    public CompanyRequestEntity() {
    }

    public CompanyRequestEntity(String requestId, String company, String description, String status, int progress) {
        this.requestId = requestId;
        this.company = company;
        this.description = description;
        this.status = status;
        this.progress = progress;
    }

    public Long getId() {
        return id;
    }

    public String getRequestId() {
        return requestId;
    }

    public String getCompany() {
        return company;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public int getProgress() {
        return progress;
    }
}
