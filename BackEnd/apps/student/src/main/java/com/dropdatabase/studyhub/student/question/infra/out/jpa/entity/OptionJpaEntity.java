package com.dropdatabase.studyhub.student.question.infra.out.jpa.entity;
import com.dropdatabase.studyhub.student.question.domain.Option;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "option")
@NoArgsConstructor
public class OptionJpaEntity {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "text", nullable = false)
    private String text;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id", referencedColumnName = "id", nullable = false)
    private QuestionJpaEntity questionJpaEntity;

    public OptionJpaEntity(Option option, QuestionJpaEntity questionJpaEntity) {
        this.id = option.getId().toString();
        this.text = option.getText();
        this.isCorrect = option.isCorrect();
        this.questionJpaEntity = questionJpaEntity;
    }

    public Option toDomainEntity() {
        return new Option(
                UUID.fromString(id),
                this.text,
                this.isCorrect
        );
    }
}