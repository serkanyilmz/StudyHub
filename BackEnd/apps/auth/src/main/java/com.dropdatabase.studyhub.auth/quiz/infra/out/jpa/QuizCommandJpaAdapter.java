package com.dropdatabase.studyhub.auth.quiz.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.quiz/infra/out/persistence/QuizJpaAdapter.java

import com.dropdatabase.studyhub.auth.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.auth.question.infra.out.jpa.QuestionJpaRepository;
import com.dropdatabase.studyhub.auth.question.infra.out.jpa.entity.QuestionJpaEntity;
import com.dropdatabase.studyhub.auth.quiz.application.port.QuizCommandPort;
import com.dropdatabase.studyhub.auth.quiz.domain.Quiz;
import com.dropdatabase.studyhub.auth.quiz.infra.out.jpa.entity.QuizJpaEntity;
import com.dropdatabase.studyhub.auth.quiz.infra.out.jpa.entity.QuizQuestionJpaEntity;
import com.dropdatabase.studyhub.auth.topic.infra.out.jpa.TopicJpaRepository;
import com.dropdatabase.studyhub.auth.topic.infra.out.jpa.entity.TopicJpaEntity;
import com.dropdatabase.studyhub.auth.writer.infra.out.jpa.WriterJpaRepository;
import com.dropdatabase.studyhub.auth.writer.infra.out.jpa.entity.WriterJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class QuizCommandJpaAdapter implements QuizCommandPort {

    private final QuizJpaRepository quizJpaRepository;
    private final TopicJpaRepository topicJpaRepository;
    private final WriterJpaRepository writerJpaRepository;
    private final QuestionJpaRepository questionJpaRepository;

    public QuizCommandJpaAdapter(QuizJpaRepository quizJpaRepository,
                                 ClassroomJpaRepository classroomJpaRepository,
                                 TopicJpaRepository topicJpaRepository,
                                 WriterJpaRepository writerJpaRepository, QuestionJpaRepository questionJpaRepository) {
        this.quizJpaRepository = quizJpaRepository;
        this.topicJpaRepository = topicJpaRepository;
        this.writerJpaRepository = writerJpaRepository;
        this.questionJpaRepository = questionJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return quizJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Quiz get(UUID id) {
        Optional<QuizJpaEntity> quizJpaEntity = quizJpaRepository.findById(id.toString());
        return quizJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Quiz newQuiz) {
        TopicJpaEntity topic = topicJpaRepository.findById(newQuiz.getTopic().getId().toString()).get();
        WriterJpaEntity writer = writerJpaRepository.findById(newQuiz.getWriter().getId().toString()).get();

        QuizJpaEntity newQuizJpaEntity = new QuizJpaEntity(newQuiz, topic, writer);

        List<QuizQuestionJpaEntity> quizQuestionJpaEntities = newQuiz.getQuestions().stream()
                .map(quizQuestion -> {
                    QuestionJpaEntity question = questionJpaRepository.findById(quizQuestion.getQuestion().getId().toString())
                            .orElseThrow(() -> new RuntimeException("Question not found"));
                    return new QuizQuestionJpaEntity(quizQuestion, newQuizJpaEntity, question);
                })
                .collect(Collectors.toList());

        newQuizJpaEntity.setQuizQuestions(quizQuestionJpaEntities);

        quizJpaRepository.save(newQuizJpaEntity);
    }

    @Override
    @Transactional
    public void update(Quiz updatedQuiz) {
        TopicJpaEntity topic = topicJpaRepository.findById(updatedQuiz.getTopic().getId().toString()).get();
        WriterJpaEntity writer = writerJpaRepository.findById(updatedQuiz.getWriter().getId().toString()).get();

        QuizJpaEntity updatedQuizJpaEntity = new QuizJpaEntity(updatedQuiz, topic, writer);

        List<QuizQuestionJpaEntity> quizQuestionJpaEntities = updatedQuiz.getQuestions().stream()
                .map(quizQuestion -> {
                    QuestionJpaEntity question = questionJpaRepository.findById(quizQuestion.getQuestion().getId().toString())
                            .orElseThrow(() -> new RuntimeException("Question not found"));
                    return new QuizQuestionJpaEntity(quizQuestion, updatedQuizJpaEntity, question);
                })
                .collect(Collectors.toList());

        updatedQuizJpaEntity.setQuizQuestions(quizQuestionJpaEntities);

        quizJpaRepository.save(updatedQuizJpaEntity);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        quizJpaRepository.deleteById(id.toString());
    }

}