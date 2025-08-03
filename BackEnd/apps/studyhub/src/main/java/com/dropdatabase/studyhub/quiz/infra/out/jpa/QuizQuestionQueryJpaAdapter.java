package com.dropdatabase.studyhub.quiz.infra.out.jpa;

import com.dropdatabase.studyhub.quiz.application.port.QuizQueryPort;
import com.dropdatabase.studyhub.quiz.application.port.QuizQuestionQueryPort;
import com.dropdatabase.studyhub.quiz.domain.Quiz;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class QuizQuestionQueryJpaAdapter implements QuizQuestionQueryPort {

    private final QuizQuestionJpaRepository quizQuestionJpaRepository;


    public QuizQuestionQueryJpaAdapter(QuizQuestionJpaRepository quizQuestionJpaRepository) {
        this.quizQuestionJpaRepository = quizQuestionJpaRepository;
    }


    @Override
    public int getQuestionNumber(UUID quizId) {
        return quizQuestionJpaRepository.countByQuiz_Id(quizId.toString());
    }


}