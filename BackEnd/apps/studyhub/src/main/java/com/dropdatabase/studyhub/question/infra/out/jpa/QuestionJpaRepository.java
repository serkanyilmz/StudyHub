package com.dropdatabase.studyhub.question.infra.out.jpa;

import com.dropdatabase.studyhub.question.infra.out.jpa.entity.QuestionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository; // JpaRepository'yi import edin
import org.springframework.stereotype.Repository; // @Repository anotasyonunu import edin

import java.util.Optional;

@Repository
public interface QuestionJpaRepository extends JpaRepository<QuestionJpaEntity, Long> {

    Optional<QuestionJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}