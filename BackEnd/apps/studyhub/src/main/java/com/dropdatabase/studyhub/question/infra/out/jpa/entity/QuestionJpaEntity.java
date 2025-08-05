package com.dropdatabase.studyhub.question.infra.out.jpa.entity;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizQuestionJpaEntity;
import com.dropdatabase.studyhub.topic.infra.out.jpa.entity.TopicJpaEntity;
import com.dropdatabase.studyhub.writer.infra.out.jpa.entity.WriterJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "question")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionJpaEntity {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "text", nullable = false)
    private String text;

    @OneToMany(mappedBy = "questionJpaEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OptionJpaEntity> options;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "writer_id", referencedColumnName = "id", nullable = false)
    private WriterJpaEntity writerJpaEntity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "topic_id", referencedColumnName = "id", nullable = false)
    private TopicJpaEntity topicJpaEntity;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestionJpaEntity> quizQuestions = new ArrayList<>();

    public QuestionJpaEntity(Question question, TopicJpaEntity topicJpaEntity, WriterJpaEntity writerJpaEntity) {
        this.id = question.getId().toString();
        this.text = question.getText();
        this.topicJpaEntity = topicJpaEntity;
        this.writerJpaEntity = writerJpaEntity;
        if (question.getOptions() != null) {
            this.options = question.getOptions().stream()
                    .map(option -> new OptionJpaEntity(option, this))
                    .collect(Collectors.toList());
        }
    }

    public Question toDomainEntity() {
        List<Option> options = new ArrayList<>();
        if (this.options != null) {
            options = this.options.stream()
                    .map(OptionJpaEntity::toDomainEntity)
                    .collect(Collectors.toList());
        }

        return new Question(
                UUID.fromString(this.id),
                this.text,
                options,
                this.topicJpaEntity.toDomainEntity(),
                this.writerJpaEntity.toDomainEntity()
        );
    }

    public void updateOptions(List<Option> newOptions) {
        // Clear existing options
        if (this.options != null) {
            this.options.clear();
        } else {
            this.options = new ArrayList<>();
        }
        
        // Add new options
        if (newOptions != null) {
            this.options.addAll(
                newOptions.stream()
                    .map(option -> new OptionJpaEntity(option, this))
                    .collect(Collectors.toList())
            );
        }
    }
}