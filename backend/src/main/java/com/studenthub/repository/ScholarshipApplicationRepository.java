package com.studenthub.repository;

import com.studenthub.entity.ScholarshipApplication;
import com.studenthub.enums.ScholarshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScholarshipApplicationRepository extends JpaRepository<ScholarshipApplication, Long> {
    List<ScholarshipApplication> findByStudentId(Long studentId);
    Optional<ScholarshipApplication> findByScholarshipIdAndStudentId(Long scholarshipId, Long studentId);
    List<ScholarshipApplication> findByStatus(ScholarshipStatus status);
}
