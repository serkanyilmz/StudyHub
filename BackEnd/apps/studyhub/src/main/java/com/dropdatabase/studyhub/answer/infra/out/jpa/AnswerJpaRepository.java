package com.dropdatabase.studyhub.answer.infra.out.jpa;

import com.dropdatabase.studyhub.answer.infra.out.jpa.entity.AnswerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerJpaRepository extends JpaRepository<AnswerJpaEntity, Long> {

    Optional<AnswerJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
    List<AnswerJpaEntity> findByStudent_IdAndQuiz_Id(String studentId, String quizId);
}