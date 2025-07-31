package com.dropdatabase.studyhub.answer.infra.out.jpa.entity;

import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.quiz.domain.Quiz;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "answer")
@NoArgsConstructor
public class AnswerJpaEntity {
    @Id
    private String id;

    private Student student;
    private Quiz quiz;
    private Question question;
    private Option option;

    public AnswerJpaEntity(Answer answer) {
        this.id = answer.getId().toString();
        this.firstName = answer.getFirstName();
        this.lastName = answer.getLastName();
        this.email = answer.getEmail();
        this.phoneNumber = answer.getPhoneNumber();
        this.registrationDate = LocalDateTime.now();
    }

    public Answer toDomainEntity() {
        return new Answer(
                UUID.fromString(id),
                this.firstName,
                this.lastName,
                this.email,
                this.phoneNumber,
                this.registrationDate
        );
    }
}