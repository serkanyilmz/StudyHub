package com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@Getter
@Setter
public class QuizQuestionId implements Serializable {

    @Column(name = "quiz_id")
    private String quizId;

    @Column(name = "question_id")
    private String questionId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuizQuestionId that = (QuizQuestionId) o;
        return Objects.equals(quizId, that.quizId) &&
                Objects.equals(questionId, that.questionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(quizId, questionId);
    }
}
