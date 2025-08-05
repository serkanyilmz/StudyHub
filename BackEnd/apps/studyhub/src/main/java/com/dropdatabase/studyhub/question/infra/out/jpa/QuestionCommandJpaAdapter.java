package com.dropdatabase.studyhub.question.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.question/infra/out/persistence/QuestionJpaAdapter.java

import com.dropdatabase.studyhub.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.QuestionJpaEntity;
import com.dropdatabase.studyhub.topic.infra.out.jpa.TopicJpaRepository;
import com.dropdatabase.studyhub.topic.infra.out.jpa.entity.TopicJpaEntity;
import com.dropdatabase.studyhub.writer.infra.out.jpa.WriterJpaRepository;
import com.dropdatabase.studyhub.writer.infra.out.jpa.entity.WriterJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class QuestionCommandJpaAdapter implements QuestionCommandPort {

    private final QuestionJpaRepository questionJpaRepository;
    private final TopicJpaRepository topicJpaRepository;
    private final WriterJpaRepository writerJpaRepository;

    public QuestionCommandJpaAdapter(QuestionJpaRepository questionJpaRepository,
                                     WriterJpaRepository writerJpaRepository,
                                     TopicJpaRepository topicJpaRepository) {
        this.questionJpaRepository = questionJpaRepository;
        this.topicJpaRepository = topicJpaRepository;
        this.writerJpaRepository = writerJpaRepository;
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
        TopicJpaEntity topicJpaEntity = topicJpaRepository.findById(newQuestion.getTopic().getId().toString())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        WriterJpaEntity writerJpaEntity = writerJpaRepository.findById(newQuestion.getWriter().getId().toString())
                    .orElseThrow(() -> new RuntimeException("Writer not found with"));
        QuestionJpaEntity newQuestionJpaEntity = new QuestionJpaEntity(newQuestion,
                    topicJpaEntity,
                    writerJpaEntity);
        questionJpaRepository.save(newQuestionJpaEntity);
    }

    @Override
    @Transactional
    public void update(Question updatedQuestion) {
        // Get the existing entity from database
        QuestionJpaEntity existingEntity = questionJpaRepository.findById(updatedQuestion.getId().toString())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Get related entities
        TopicJpaEntity topicJpaEntity = topicJpaRepository.findById(updatedQuestion.getTopic().getId().toString())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        WriterJpaEntity writerJpaEntity = writerJpaRepository.findById(updatedQuestion.getWriter().getId().toString())
                .orElseThrow(() -> new RuntimeException("Writer not found"));
        
        // Update fields on existing entity
        existingEntity.setText(updatedQuestion.getText());
        existingEntity.setTopicJpaEntity(topicJpaEntity);
        existingEntity.setWriterJpaEntity(writerJpaEntity);
        existingEntity.updateOptions(updatedQuestion.getOptions());
        
        // Save the updated entity
        questionJpaRepository.save(existingEntity);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        questionJpaRepository.deleteById(id.toString());
    }
}