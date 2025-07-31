package com.dropdatabase.studyhub.answer.domain;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class Answer {
    private UUID id;
    private UUID studentId;
    private UUID quizId;
    private UUID questionId;
    private UUID optionId;


    public Answer(UUID studentId,UUID quizId,UUID questionId,UUID optionId) {
        this.id = UUID.randomUUID();
        this.studentId = studentId;
        this.quizId = quizId;
        this.questionId = questionId;
        this.optionId = optionId;
    }

    public Answer(UUID id, UUID studentId,UUID quizId,UUID questionId,UUID optionId) {
        this.id = id;
        this.id = UUID.randomUUID();
        this.studentId = studentId;
        this.quizId = quizId;
        this.questionId = questionId;
        this.optionId = optionId;
    }
}