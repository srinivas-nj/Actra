package com.actra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "submissions")
public class SubmissionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String submissionId;

    @Column(nullable = false)
    private String contributorName;

    @Column(nullable = false)
    private String taskId;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String notes;

    @Column(nullable = false)
    private String status;

    public SubmissionEntity() {
    }

    public SubmissionEntity(String submissionId, String contributorName, String taskId, String location, String notes, String status) {
        this.submissionId = submissionId;
        this.contributorName = contributorName;
        this.taskId = taskId;
        this.location = location;
        this.notes = notes;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getSubmissionId() {
        return submissionId;
    }

    public String getContributorName() {
        return contributorName;
    }

    public String getTaskId() {
        return taskId;
    }

    public String getLocation() {
        return location;
    }

    public String getNotes() {
        return notes;
    }

    public String getStatus() {
        return status;
    }
}
