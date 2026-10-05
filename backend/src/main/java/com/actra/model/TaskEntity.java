package com.actra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tasks")
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String taskId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String environment;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private int reward;

    @Column(nullable = false)
    private int completionDays;

    @Column(nullable = false)
    private String status;

    public TaskEntity() {
    }

    public TaskEntity(String taskId, String title, String environment, String priority, int reward,
                     int completionDays, String status) {
        this.taskId = taskId;
        this.title = title;
        this.environment = environment;
        this.priority = priority;
        this.reward = reward;
        this.completionDays = completionDays;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getTaskId() {
        return taskId;
    }

    public String getTitle() {
        return title;
    }

    public String getEnvironment() {
        return environment;
    }

    public String getPriority() {
        return priority;
    }

    public int getReward() {
        return reward;
    }

    public int getCompletionDays() {
        return completionDays;
    }

    public String getStatus() {
        return status;
    }
}
