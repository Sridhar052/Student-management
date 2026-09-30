package com.studenthub.repository;

import com.studenthub.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByRegisterNumber(String registerNumber);
    Optional<Student> findByStudentId(String studentId);

    List<Student> findByDepartment(String department);
    List<Student> findByYear(Integer year);
    List<Student> findByStatus(String status);

    @Query("SELECT s FROM Student s WHERE " +
           "(:search IS NULL OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.registerNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:department IS NULL OR s.department = :department) AND " +
           "(:year IS NULL OR s.year = :year) AND " +
           "(:status IS NULL OR s.status = :status)")
    List<Student> searchStudents(@Param("search") String search,
                                 @Param("department") String department,
                                 @Param("year") Integer year,
                                 @Param("status") String status);
}
