package com.dropdatabase.studyhub.student.quiz.domain;

import com.dropdatabase.studyhub.student.question.domain.Question;
import lombok.Getter;

@Getter
public class QuizQuestion {
    private Question question;
    private int questionNo;

    public QuizQuestion(Question question, int questionNo) {
        this.question = question;
        this.questionNo = questionNo;
    }
}