package com.dropdatabase.studyhub.employee.question.infra.out.jpa.entity;
import com.dropdatabase.studyhub.employee.question.domain.Option;
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

    @Column(name = "text", unique = true, nullable = false)
    private String text;

    @Column(name = "isCorrect", nullable = false)
    private boolean isCorrect;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
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