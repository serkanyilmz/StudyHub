package com.dropdatabase.studyhub.employee.quiz.domain;

import com.dropdatabase.studyhub.employee.question.domain.Question;
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