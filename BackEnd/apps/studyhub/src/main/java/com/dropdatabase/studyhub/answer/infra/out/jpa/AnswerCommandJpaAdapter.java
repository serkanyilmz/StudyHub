package com.dropdatabase.studyhub.answer.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.answer/infra/out/persistence/AnswerJpaAdapter.java

import com.dropdatabase.studyhub.answer.infra.out.jpa.entity.AnswerJpaEntity;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.answer.application.port.AnswerCommandPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class AnswerCommandJpaAdapter implements AnswerCommandPort {

    private final AnswerJpaRepository answerJpaRepository;

    public AnswerCommandJpaAdapter(AnswerJpaRepository answerJpaRepository,
                                   ClassroomJpaRepository classroomJpaRepository) {
        this.answerJpaRepository = answerJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return answerJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Answer get(UUID id) {
        Optional<AnswerJpaEntity> answerJpaEntity = answerJpaRepository.findById(id.toString());
        return answerJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Answer newAnswer) {
        AnswerJpaEntity newAnswerJpaEntity = new AnswerJpaEntity(newAnswer);
        AnswerJpaEntity savedAnswerJpaEntity = answerJpaRepository.save(newAnswerJpaEntity);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        answerJpaRepository.deleteById(id.toString());
    }

}