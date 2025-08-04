package com.dropdatabase.studyhub.answer.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.answer/infra/out/persistence/AnswerJpaAdapter.java

import com.dropdatabase.studyhub.answer.infra.out.jpa.entity.AnswerJpaEntity;
import com.dropdatabase.studyhub.answer.application.port.AnswerQueryPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class AnswerQueryJpaAdapter implements AnswerQueryPort {

    private final AnswerJpaRepository answerJpaRepository;

    public AnswerQueryJpaAdapter(AnswerJpaRepository answerJpaRepository) {
        this.answerJpaRepository = answerJpaRepository;
    }

    @Override
    public Answer get(UUID id) {
        Optional<AnswerJpaEntity> answerJpaEntityOptional = answerJpaRepository.findById(id.toString());
        return answerJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Answer> getAll() {
        List<AnswerJpaEntity> answersJpaList = answerJpaRepository.findAll();
        List<Answer> answers = answersJpaList.stream()
                .map(AnswerJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return answers;
    }

    @Override
    public List<Answer> findByStudentIdAndQuizId(UUID studentId, UUID quizId) {
        List<AnswerJpaEntity> entities = answerJpaRepository.findByStudent_IdAndQuiz_Id(studentId.toString(), quizId.toString());
        return entities.stream()
                .map(AnswerJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
    }
}