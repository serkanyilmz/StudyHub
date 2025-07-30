package com.dropdatabase.studyhub.quiz.infra.out.jpa.entity;

import com.dropdatabase.studyhub.question.infra.out.jpa.entity.QuestionJpaEntity;
import com.dropdatabase.studyhub.quiz.domain.QuizQuestion;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.id.QuizQuestionId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "quiz_question")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionJpaEntity {

    @EmbeddedId
    private QuizQuestionId id;

    @ManyToOne
    @MapsId("quizId")
    private QuizJpaEntity quiz;

    @ManyToOne
    @MapsId("questionId")
    private QuestionJpaEntity question;

    @Column(name = "question_no", nullable = false)
    private int questionNo;

    public QuizQuestionJpaEntity(QuizQuestion quizQuestion,
                                 QuizJpaEntity quizJpaEntity,
                                 QuestionJpaEntity questionJpaEntity) {
        this.quiz = quizJpaEntity;
        this.question = questionJpaEntity;
        this.questionNo = quizQuestion.getQuestionNo();
        this.id = new QuizQuestionId(quizJpaEntity.getId(), questionJpaEntity.getId());
    }

    public QuizQuestion toDomainEntity() {
        return new QuizQuestion(
                this.question.toDomainEntity(),
                this.questionNo
        );
    }
}