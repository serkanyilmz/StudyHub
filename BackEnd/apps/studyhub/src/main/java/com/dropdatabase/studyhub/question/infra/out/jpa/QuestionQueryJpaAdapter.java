package com.dropdatabase.studyhub.question.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.question/infra/out/persistence/QuestionJpaAdapter.java

import com.dropdatabase.studyhub.question.application.port.QuestionQueryPort;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.QuestionJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class QuestionQueryJpaAdapter implements QuestionQueryPort {

    private final QuestionJpaRepository questionJpaRepository;

    public QuestionQueryJpaAdapter(QuestionJpaRepository questionJpaRepository) {
        this.questionJpaRepository = questionJpaRepository;
    }

    @Override
    public Question get(UUID id) {
        Optional<QuestionJpaEntity> questionJpaEntityOptional = questionJpaRepository.findById(id.toString());
        return questionJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Question> getAll() {
        List<QuestionJpaEntity> questionsJpaList = questionJpaRepository.findAll();
        List<Question> questions = questionsJpaList.stream()
                .map(QuestionJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return questions;
    }
}