package com.dropdatabase.studyhub.student.infra.out.jpa;

import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentJpaRepository extends JpaRepository<StudentJpaEntity, Long> {

    Optional<StudentJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}