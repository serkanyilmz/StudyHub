package com.dropdatabase.studyhub.auth.quiz.infra.out.jpa;

import com.dropdatabase.studyhub.auth.quiz.infra.out.jpa.entity.QuizJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizJpaRepository extends JpaRepository<QuizJpaEntity, Long> {

    Optional<QuizJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}