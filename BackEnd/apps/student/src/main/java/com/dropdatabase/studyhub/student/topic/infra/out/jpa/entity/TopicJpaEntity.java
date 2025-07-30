package com.dropdatabase.studyhub.student.topic.infra.out.jpa.entity;

import com.dropdatabase.studyhub.student.topic.domain.Topic;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Table(name = "topic")
@NoArgsConstructor
public class TopicJpaEntity {
    @Id
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_topic_id")
    private TopicJpaEntity parentTopic;

    @OneToMany(mappedBy = "parentTopic", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TopicJpaEntity> childTopics = new ArrayList<>();

    public TopicJpaEntity(Topic topic, TopicJpaEntity parentTopicJpaEntity) {
        this.id = topic.getId().toString();
        this.name = topic.getName();
        this.parentTopic = parentTopicJpaEntity;
    }

    public Topic toDomainEntity() {
        Topic domainParentTopic = null;
        if (this.parentTopic != null) {
            domainParentTopic = this.parentTopic.toDomainEntity();
        }
        return new Topic(
                UUID.fromString(this.id),
                this.name,
                domainParentTopic
        );
    }
}