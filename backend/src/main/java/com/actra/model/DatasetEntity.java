package com.actra.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "datasets")
public class DatasetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String focus;

    @Column(nullable = false)
    private int demos;

    @Column(nullable = false)
    private double durationHours;

    @Column(nullable = false)
    private double qualityScore;

    @Column(nullable = false)
    private String status;

    public DatasetEntity() {
    }

    public DatasetEntity(String slug, String name, String focus, int demos, double durationHours,
                        double qualityScore, String status) {
        this.slug = slug;
        this.name = name;
        this.focus = focus;
        this.demos = demos;
        this.durationHours = durationHours;
        this.qualityScore = qualityScore;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getFocus() {
        return focus;
    }

    public int getDemos() {
        return demos;
    }

    public double getDurationHours() {
        return durationHours;
    }

    public double getQualityScore() {
        return qualityScore;
    }

    public String getStatus() {
        return status;
    }
}
