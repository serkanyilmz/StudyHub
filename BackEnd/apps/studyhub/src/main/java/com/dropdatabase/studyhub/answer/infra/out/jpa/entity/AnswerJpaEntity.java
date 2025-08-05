package com.dropdatabase.studyhub.answer.infra.out.jpa.entity;

import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.OptionJpaEntity;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.QuestionJpaEntity;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizJpaEntity;
import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "answer")
@NoArgsConstructor
@Getter
public class AnswerJpaEntity {
    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentJpaEntity student;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private QuizJpaEntity quiz;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionJpaEntity question;

    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    private OptionJpaEntity option;

    public AnswerJpaEntity(Answer answer,
                           StudentJpaEntity student,
                           QuizJpaEntity quiz,
                           QuestionJpaEntity question,
                           OptionJpaEntity option) {
        this.id = answer.getId().toString();
        this.student = student;
        this.quiz = quiz;
        this.question = question;
        this.option = option;
    }

    public Answer toDomainEntity() {
        return new Answer(
                UUID.fromString(id),
                this.student.toDomainEntity(),
                this.quiz.toDomainEntity(),
                this.question.toDomainEntity(),
                this.option.toDomainEntity()
        );
    }
}