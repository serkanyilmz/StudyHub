package com.dropdatabase.studyhub.employee.quiz.infra.out.jpa.entity;

import com.dropdatabase.studyhub.employee.quiz.domain.Quiz;
import com.dropdatabase.studyhub.employee.quiz.domain.QuizQuestion;
import com.dropdatabase.studyhub.employee.topic.infra.out.jpa.entity.TopicJpaEntity;
import com.dropdatabase.studyhub.employee.writer.infra.out.jpa.entity.WriterJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "quiz")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizJpaEntity {
    @Id
    private String id;

    @Column
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private TopicJpaEntity topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = false)
    private WriterJpaEntity writer;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizQuestionJpaEntity> quizQuestions;

    public QuizJpaEntity(Quiz quiz,
                         TopicJpaEntity topic,
                         WriterJpaEntity writer) {
        this.id = quiz.getId().toString();
        this.name = quiz.getName();
        this.topic = topic;
        this.writer = writer;
    }

    public Quiz toDomainEntity() {
        List<QuizQuestion> domainQuizQuestions = this.quizQuestions.stream()
                .map(QuizQuestionJpaEntity::toDomainEntity)
                .collect(Collectors.toList()); // Correctly collect the results into a new List

        return new Quiz(
                UUID.fromString(id),
                this.name,
                domainQuizQuestions,
                this.topic.toDomainEntity(),
                this.writer.toDomainEntity()
        );
    }
}