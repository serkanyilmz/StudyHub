package com.dropdatabase.studyhub.student.topic.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.student.topic/infra/out/persistence/TopicJpaAdapter.java

import com.dropdatabase.studyhub.student.topic.application.port.TopicCommandPort;
import com.dropdatabase.studyhub.student.topic.domain.Topic;
import com.dropdatabase.studyhub.student.topic.infra.out.jpa.entity.TopicJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class TopicCommandJpaAdapter implements TopicCommandPort {

    private final com.dropdatabase.studyhub.student.topic.infra.out.jpa.TopicJpaRepository topicJpaRepository;

    public TopicCommandJpaAdapter(TopicJpaRepository topicJpaRepository) {
        this.topicJpaRepository = topicJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return topicJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Topic get(UUID id) {
        if (id==null) return null;
        Optional<TopicJpaEntity> topicJpaEntity = topicJpaRepository.findById(id.toString());
        return topicJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Topic newTopic) {
        TopicJpaEntity parentTopicJpaEntity = null;
        if (newTopic.getParentTopic() != null) {
            parentTopicJpaEntity = topicJpaRepository.findById(newTopic.getParentTopic().getId().toString()).orElse(null);
        }
        TopicJpaEntity newTopicJpaEntity = new TopicJpaEntity(newTopic, parentTopicJpaEntity);
        topicJpaRepository.save(newTopicJpaEntity);
    }

    @Override
    @Transactional
    public void update(Topic updatedTopic) {
        TopicJpaEntity updatedparentTopicJpaEntity = null;
        if (updatedTopic.getParentTopic() != null) {
            updatedparentTopicJpaEntity = topicJpaRepository.findById(updatedTopic.getParentTopic().getId().toString()).orElse(null);
        }
        TopicJpaEntity updatedTopicJpaEntity = new TopicJpaEntity(updatedTopic, updatedparentTopicJpaEntity);

        TopicJpaEntity savedTopicJpaEntity = topicJpaRepository.save(updatedTopicJpaEntity);
        savedTopicJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        topicJpaRepository.deleteById(id.toString());
    }

}