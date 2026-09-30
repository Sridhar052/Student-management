package com.studenthub.repository;

import com.studenthub.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByStudentId(Long studentId);
    List<Mark> findByStudentIdAndSemester(Long studentId, Integer semester);
    Optional<Mark> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
