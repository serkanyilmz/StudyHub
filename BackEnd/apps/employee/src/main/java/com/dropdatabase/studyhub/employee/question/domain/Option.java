package com.dropdatabase.studyhub.employee.question.domain;

import lombok.Getter;
import java.util.UUID;

@Getter
public class Option {
    private UUID id;
    private String text;
    private boolean isCorrect;
    private Question question;

    public Option(String text, boolean isCorrect, Question question) {
        this.id = UUID.randomUUID();
        this.text = text;
        this.isCorrect = isCorrect;
        this.question = question;
    }

    public Option(UUID id, String text, boolean isCorrect, Question question) {
        this.id = id;
        this.text = text;
        this.isCorrect = isCorrect;
        this.question = question;
    }
}