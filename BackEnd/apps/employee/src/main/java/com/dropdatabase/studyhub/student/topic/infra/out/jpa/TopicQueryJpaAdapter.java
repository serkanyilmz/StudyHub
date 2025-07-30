package com.dropdatabase.studyhub.student.topic.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.topic/infra/out/persistence/TopicJpaAdapter.java

import com.dropdatabase.studyhub.student.topic.application.port.TopicQueryPort;
import com.dropdatabase.studyhub.student.topic.domain.Topic;
import com.dropdatabase.studyhub.student.topic.infra.out.jpa.entity.TopicJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TopicQueryJpaAdapter implements TopicQueryPort {

    private final com.dropdatabase.studyhub.student.topic.infra.out.jpa.TopicJpaRepository topicJpaRepository;

    public TopicQueryJpaAdapter(TopicJpaRepository topicJpaRepository) {
        this.topicJpaRepository = topicJpaRepository;
    }

    @Override
    public Topic get(UUID id) {
        Optional<TopicJpaEntity> topicJpaEntityOptional = topicJpaRepository.findById(id.toString());
        return topicJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Topic> getAll() {
        List<TopicJpaEntity> topicsJpaList = topicJpaRepository.findAll();
        return topicsJpaList.stream()
                .map(TopicJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
    }
}