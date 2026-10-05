package com.actra.api.controller;

import com.actra.model.AdminQueueEntity;
import com.actra.model.CompanyRequestEntity;
import com.actra.model.DatasetEntity;
import com.actra.model.Role;
import com.actra.model.SubmissionEntity;
import com.actra.model.TaskEntity;
import com.actra.repository.AdminQueueRepository;
import com.actra.repository.CompanyRequestRepository;
import com.actra.repository.DatasetRepository;
import com.actra.repository.SubmissionRepository;
import com.actra.repository.TaskRepository;
import com.actra.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final UserRepository userRepository;
    private final DatasetRepository datasetRepository;
    private final TaskRepository taskRepository;
    private final CompanyRequestRepository companyRequestRepository;
    private final AdminQueueRepository adminQueueRepository;
    private final SubmissionRepository submissionRepository;

    public ApiController(
        UserRepository userRepository,
        DatasetRepository datasetRepository,
        TaskRepository taskRepository,
        CompanyRequestRepository companyRequestRepository,
        AdminQueueRepository adminQueueRepository,
        SubmissionRepository submissionRepository
    ) {
        this.userRepository = userRepository;
        this.datasetRepository = datasetRepository;
        this.taskRepository = taskRepository;
        this.companyRequestRepository = companyRequestRepository;
        this.adminQueueRepository = adminQueueRepository;
        this.submissionRepository = submissionRepository;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "service", "Actra Platform",
            "timestamp", Instant.now().toString()
        );
    }

    @GetMapping("/overview")
    public OverviewDto overview() {
        List<DatasetEntity> datasets = datasetRepository.findAll();
        int contributors = Math.toIntExact(userRepository.countByRole(Role.CONTRIBUTOR));
        int companies = Math.toIntExact(userRepository.countByRole(Role.COMPANY));
        int approved = Math.toIntExact(datasets.stream().filter(dataset -> "Approved".equalsIgnoreCase(dataset.getStatus()) || "Premium".equalsIgnoreCase(dataset.getStatus()) || "Licensed".equalsIgnoreCase(dataset.getStatus())).count());
        double averageQuality = datasets.stream().mapToDouble(DatasetEntity::getQualityScore).average().orElse(0.0);
        int activeCampaigns = Math.toIntExact(taskRepository.countByStatus("Open") + taskRepository.countByStatus("In review"));

        return new OverviewDto(contributors, companies, datasets.size(), approved, averageQuality, activeCampaigns);
    }

    @GetMapping("/datasets")
    public List<DatasetDto> datasets() {
        return datasetRepository.findAll().stream()
            .map(dataset -> new DatasetDto(
                dataset.getSlug(),
                dataset.getName(),
                dataset.getFocus(),
                dataset.getDemos(),
                dataset.getDurationHours(),
                dataset.getQualityScore(),
                dataset.getStatus()))
            .collect(Collectors.toList());
    }

    @GetMapping("/tasks")
    public List<TaskDto> tasks() {
        return taskRepository.findAll().stream()
            .map(task -> new TaskDto(
                task.getTaskId(),
                task.getTitle(),
                task.getEnvironment(),
                task.getPriority(),
                task.getReward(),
                task.getCompletionDays(),
                task.getStatus()))
            .collect(Collectors.toList());
    }

    @GetMapping("/requests")
    public List<CompanyRequestDto> requests() {
        return companyRequestRepository.findAll().stream()
            .map(request -> new CompanyRequestDto(
                request.getRequestId(),
                request.getCompany(),
                request.getDescription(),
                request.getStatus(),
                request.getProgress()))
            .collect(Collectors.toList());
    }

    @GetMapping("/queue")
    public List<AdminQueueDto> queue() {
        return adminQueueRepository.findAll().stream()
            .map(queueItem -> new AdminQueueDto(
                queueItem.getQueueId(),
                queueItem.getContributor(),
                queueItem.getTitle(),
                queueItem.getStatus(),
                queueItem.getRiskFlags()))
            .collect(Collectors.toList());
    }

    @GetMapping("/metrics")
    public Map<String, Object> metrics() {
        List<DatasetEntity> datasets = datasetRepository.findAll();
        double averageDatasetQuality = datasets.stream().mapToDouble(DatasetEntity::getQualityScore).average().orElse(0.0);

        return Map.of(
            "revenueThisQuarter", "$1.42M",
            "averageDatasetQuality", String.format("%.1f%%", averageDatasetQuality),
            "ethicalCompliance", "99.1%",
            "activeContributors", Math.toIntExact(userRepository.countByRole(Role.CONTRIBUTOR)),
            "freshSubmissions", submissionRepository.count()
        );
    }

    @PostMapping("/submissions")
    public SubmissionDto submitSubmission(@RequestBody SubmissionRequest request) {
        String submissionId = "sub-" + System.currentTimeMillis();
        SubmissionEntity submission = submissionRepository.save(new SubmissionEntity(
            submissionId,
            request.contributorName() == null || request.contributorName().isBlank() ? "Contributor" : request.contributorName(),
            request.taskId(),
            request.location() == null || request.location().isBlank() ? "Unknown" : request.location(),
            request.notes() == null || request.notes().isBlank() ? "Contributor submission metadata." : request.notes(),
            "Metadata saved"
        ));

        return new SubmissionDto(
            submission.getSubmissionId(),
            submission.getStatus(),
            submission.getTaskId(),
            "Submission metadata saved. Video upload and admin review integration are not implemented."
        );
    }

    public record OverviewDto(
        int contributors,
        int companies,
        int datasets,
        int approved,
        double averageQuality,
        int activeCampaigns
    ) {}

    public record DatasetDto(
        String id,
        String name,
        String focus,
        int demos,
        double durationHours,
        double qualityScore,
        String status
    ) {}

    public record TaskDto(
        String id,
        String title,
        String environment,
        String priority,
        int reward,
        int completionDays,
        String status
    ) {}

    public record CompanyRequestDto(
        String id,
        String company,
        String description,
        String status,
        int progress
    ) {}

    public record AdminQueueDto(
        String id,
        String contributor,
        String title,
        String status,
        int riskFlags
    ) {}

    public record SubmissionRequest(
        String contributorName,
        String taskId,
        String location,
        String notes
    ) {}

    public record SubmissionDto(
        String id,
        String status,
        String taskId,
        String message
    ) {}
}
