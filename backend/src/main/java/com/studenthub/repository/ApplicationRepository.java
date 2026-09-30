package com.studenthub.repository;

import com.studenthub.entity.Application;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.ApplicationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByApplicationType(ApplicationType applicationType);
    Long countByStatus(ApplicationStatus status);
}
