package com.actra.config;

import com.actra.model.AdminQueueEntity;
import com.actra.model.CompanyRequestEntity;
import com.actra.model.DatasetEntity;
import com.actra.model.Role;
import com.actra.model.TaskEntity;
import com.actra.model.UserEntity;
import com.actra.repository.AdminQueueRepository;
import com.actra.repository.CompanyRequestRepository;
import com.actra.repository.DatasetRepository;
import com.actra.repository.TaskRepository;
import com.actra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final DatasetRepository datasetRepository;
    private final TaskRepository taskRepository;
    private final CompanyRequestRepository companyRequestRepository;
    private final AdminQueueRepository adminQueueRepository;
    private final PasswordEncoder passwordEncoder;
    private final String demoPassword;

    public DataSeeder(
        UserRepository userRepository,
        DatasetRepository datasetRepository,
        TaskRepository taskRepository,
        CompanyRequestRepository companyRequestRepository,
        AdminQueueRepository adminQueueRepository,
        PasswordEncoder passwordEncoder,
        @Value("${actra.demo-password:}") String demoPassword
    ) {
        this.userRepository = userRepository;
        this.datasetRepository = datasetRepository;
        this.taskRepository = taskRepository;
        this.companyRequestRepository = companyRequestRepository;
        this.adminQueueRepository = adminQueueRepository;
        this.passwordEncoder = passwordEncoder;
        this.demoPassword = demoPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() == 0 && !demoPassword.isBlank()) {
            userRepository.saveAll(java.util.List.of(
                new UserEntity("alice_contributor", "alice@actra.ai", passwordEncoder.encode(demoPassword), Role.CONTRIBUTOR),
                new UserEntity("northstar_company", "northstar@actra.ai", passwordEncoder.encode(demoPassword), Role.COMPANY),
                new UserEntity("admin_ops", "admin@actra.ai", passwordEncoder.encode(demoPassword), Role.ADMIN)
            ));
        }

        if (datasetRepository.count() == 0) {
            datasetRepository.saveAll(java.util.List.of(
                new DatasetEntity("ds-104", "Pick & Place Human Demonstrations", "Household robotics", 12400, 8.7, 98.5, "Approved"),
                new DatasetEntity("ds-215", "Tool Use Benchmarks", "Manufacturing", 8600, 6.3, 94.8, "Premium"),
                new DatasetEntity("ds-318", "Kitchen Task Actions", "Home automation", 15200, 11.4, 97.1, "Licensed"),
                new DatasetEntity("ds-422", "Warehouse Movement Sequences", "Logistics", 9700, 7.9, 95.3, "New")
            ));
        }

        if (taskRepository.count() == 0) {
            taskRepository.saveAll(java.util.List.of(
                new TaskEntity("task-301", "Pick and place household item", "Contributor studio", "High priority", 45, 3, "Open"),
                new TaskEntity("task-204", "Open cabinet and retrieve tool", "Warehouse mock-up", "Required", 30, 2, "Open"),
                new TaskEntity("task-119", "Stack boxes in labeled bins", "Logistics layout", "Quality gate", 51, 5, "In review"),
                new TaskEntity("task-067", "Use drill with safety posture", "Training room", "Safety first", 24, 1, "Open")
            ));
        }

        if (companyRequestRepository.count() == 0) {
            companyRequestRepository.saveAll(java.util.List.of(
                new CompanyRequestEntity("req-440", "Northstar Robotics", "50,000 demonstrations of assembly actions", "In progress", 68),
                new CompanyRequestEntity("req-318", "Helio Labs", "10,000 kitchen task trajectories", "Awaiting approval", 32),
                new CompanyRequestEntity("req-201", "Aster Manufacturing", "Inventory handling sequences", "Approved", 94)
            ));
        }

        if (adminQueueRepository.count() == 0) {
            adminQueueRepository.saveAll(java.util.List.of(
                new AdminQueueEntity("sub-302", "Contributor 12", "Kitchen task validation", "Needs review", 2),
                new AdminQueueEntity("sub-188", "Contributor 28", "Warehouse sequence", "Approved", 0),
                new AdminQueueEntity("sub-447", "Contributor 44", "Tool handling", "Flagged for compliance", 5)
            ));
        }
    }
}
