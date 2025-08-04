package com.dropdatabase.studyhub.quiz.infra.out.jpa;

import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizQuestionJpaEntity;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.id.QuizQuestionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizQuestionJpaRepository extends JpaRepository<QuizQuestionJpaEntity, QuizQuestionId> {

    int countByQuiz_Id(String quizId);
}
