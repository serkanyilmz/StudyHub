package com.dropdatabase.studyhub.employee.question.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.question/infra/out/persistence/QuestionJpaAdapter.java

import com.dropdatabase.studyhub.employee.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.employee.question.domain.Question;
import com.dropdatabase.studyhub.employee.question.infra.out.jpa.QuestionJpaRepository;
import com.dropdatabase.studyhub.employee.question.infra.out.jpa.entity.QuestionJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class QuestionCommandJpaAdapter implements QuestionCommandPort {

    private final com.dropdatabase.studyhub.employee.question.infra.out.jpa.QuestionJpaRepository questionJpaRepository;

    public QuestionCommandJpaAdapter(QuestionJpaRepository questionJpaRepository) {
        this.questionJpaRepository = questionJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return questionJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Question get(UUID id) {
        Optional<QuestionJpaEntity> questionJpaEntity = questionJpaRepository.findById(id.toString());
        return questionJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Question newQuestion) {
        QuestionJpaEntity newQuestionJpaEntity = new QuestionJpaEntity(newQuestion);
        QuestionJpaEntity savedQuestionJpaEntity = questionJpaRepository.save(newQuestionJpaEntity);
    }

    @Override
    @Transactional
    public void update(Question updatedQuestion) {
        QuestionJpaEntity updatedQuestionJpaEntity = new QuestionJpaEntity(updatedQuestion);
        QuestionJpaEntity savedQuestionJpaEntity = questionJpaRepository.save(updatedQuestionJpaEntity);
        savedQuestionJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        questionJpaRepository.deleteById(id.toString());
    }
}