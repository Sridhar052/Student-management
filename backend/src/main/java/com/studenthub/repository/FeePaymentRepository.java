package com.studenthub.repository;

import com.studenthub.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByStudentIdOrderByPaymentDateDesc(Long studentId);
    List<FeePayment> findByStudentFeeId(Long studentFeeId);
    Optional<FeePayment> findByTransactionId(String transactionId);
    Optional<FeePayment> findByReceiptNumber(String receiptNumber);
}
