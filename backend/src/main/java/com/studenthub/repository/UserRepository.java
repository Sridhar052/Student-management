package com.studenthub.repository;

import com.studenthub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByRegisterNumber(String registerNumber);
    Optional<User> findByEmail(String email);
    Boolean existsByRegisterNumber(String registerNumber);
    Boolean existsByEmail(String email);
}
