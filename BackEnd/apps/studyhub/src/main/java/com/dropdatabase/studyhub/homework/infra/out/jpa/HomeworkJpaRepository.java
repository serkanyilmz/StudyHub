package com.dropdatabase.studyhub.homework.infra.out.jpa;

import com.dropdatabase.studyhub.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HomeworkJpaRepository extends JpaRepository<HomeworkJpaEntity, Long> {

    Optional<HomeworkJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}