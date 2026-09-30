package com.studenthub.repository;

import com.studenthub.entity.StudentFee;
import com.studenthub.enums.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentFeeRepository extends JpaRepository<StudentFee, Long> {
    List<StudentFee> findByStudentId(Long studentId);
    List<StudentFee> findByStatus(FeeStatus status);

    @Query("SELECT SUM(sf.totalAmount) FROM StudentFee sf")
    Double getTotalFeeSum();

    @Query("SELECT SUM(sf.paidAmount) FROM StudentFee sf")
    Double getPaidFeeSum();

    @Query("SELECT SUM(sf.pendingAmount) FROM StudentFee sf")
    Double getPendingFeeSum();
}
