package com.dropdatabase.studyhub.employee.question.infra.out.jpa.entity;
import com.dropdatabase.studyhub.employee.question.domain.Option;
import com.dropdatabase.studyhub.employee.question.domain.Question;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "question")
@Getter
@NoArgsConstructor
public class QuestionJpaEntity {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "text", nullable = false)
    private String text;

    @OneToMany(mappedBy = "questionJpaEntity", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OptionJpaEntity> options = new ArrayList<>();

    public QuestionJpaEntity(Question question) {
        this.id = question.getId().toString();
        this.text = question.getText();
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
                options
        );
    }
}