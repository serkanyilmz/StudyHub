package com.dropdatabase.studyhub.answer.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.answer/infra/out/persistence/AnswerJpaAdapter.java

import com.dropdatabase.studyhub.answer.infra.out.jpa.entity.AnswerJpaEntity;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.answer.application.port.AnswerCommandPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.question.infra.out.jpa.OptionJpaRepository;
import com.dropdatabase.studyhub.question.infra.out.jpa.QuestionJpaRepository;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.OptionJpaEntity;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.QuestionJpaEntity;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.QuizJpaRepository;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizJpaEntity;
import com.dropdatabase.studyhub.student.infra.out.jpa.StudentJpaRepository;
import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class AnswerCommandJpaAdapter implements AnswerCommandPort {

    private final AnswerJpaRepository answerJpaRepository;
    private final StudentJpaRepository studentJpaRepository;
    private final QuizJpaRepository quizJpaRepository;
    private final QuestionJpaRepository questionJpaRepository;
    private final OptionJpaRepository optionJpaRepository;

    public AnswerCommandJpaAdapter(AnswerJpaRepository answerJpaRepository,
                                   StudentJpaRepository studentJpaRepository,
                                   QuizJpaRepository quizJpaRepository,
                                   QuestionJpaRepository questionJpaRepository,
                                   OptionJpaRepository optionJpaRepository) {
        this.answerJpaRepository = answerJpaRepository;
        this.studentJpaRepository = studentJpaRepository;
        this.quizJpaRepository = quizJpaRepository;
        this.questionJpaRepository = questionJpaRepository;
        this.optionJpaRepository = optionJpaRepository;
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
    public void add(Answer answer) {
        StudentJpaEntity student = studentJpaRepository.findById(answer.getStudent().getId().toString()).get();
        QuizJpaEntity quiz = quizJpaRepository.findById(answer.getQuiz().getId().toString()).get();
        QuestionJpaEntity question = questionJpaRepository.findById(answer.getQuestion().getId().toString()).get();
        OptionJpaEntity option = optionJpaRepository.findById(answer.getOption().getId().toString()).get();

        AnswerJpaEntity newAnswerJpaEntity = new AnswerJpaEntity(answer,
                student,
                quiz,
                question,
                option);
        AnswerJpaEntity savedAnswerJpaEntity = answerJpaRepository.save(newAnswerJpaEntity);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        answerJpaRepository.deleteById(id.toString());
    }

}