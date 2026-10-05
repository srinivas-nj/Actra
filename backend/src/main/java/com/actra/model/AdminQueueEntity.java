package com.actra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_queue")
public class AdminQueueEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String queueId;

    @Column(nullable = false)
    private String contributor;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private int riskFlags;

    public AdminQueueEntity() {
    }

    public AdminQueueEntity(String queueId, String contributor, String title, String status, int riskFlags) {
        this.queueId = queueId;
        this.contributor = contributor;
        this.title = title;
        this.status = status;
        this.riskFlags = riskFlags;
    }

    public Long getId() {
        return id;
    }

    public String getQueueId() {
        return queueId;
    }

    public String getContributor() {
        return contributor;
    }

    public String getTitle() {
        return title;
    }

    public String getStatus() {
        return status;
    }

    public int getRiskFlags() {
        return riskFlags;
    }
}
