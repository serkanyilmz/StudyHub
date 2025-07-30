package com.dropdatabase.studyhub.student.quiz.infra.out.jpa;

import com.dropdatabase.studyhub.student.quiz.application.port.QuizQueryPort;
import com.dropdatabase.studyhub.student.quiz.domain.Quiz;
import com.dropdatabase.studyhub.student.quiz.infra.out.jpa.entity.QuizJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class QuizQueryJpaAdapter implements QuizQueryPort {

    private final com.dropdatabase.studyhub.student.quiz.infra.out.jpa.QuizJpaRepository quizJpaRepository;

    public QuizQueryJpaAdapter(QuizJpaRepository quizJpaRepository) {
        this.quizJpaRepository = quizJpaRepository;
    }

    @Override
    public Quiz get(UUID id) {
        Optional<QuizJpaEntity> quizJpaEntityOptional = quizJpaRepository.findById(id.toString());
        return quizJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Quiz> getAll() {
        List<QuizJpaEntity> quizsJpaList = quizJpaRepository.findAll();
        return quizsJpaList.stream()
                .map(QuizJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
    }
}