package com.dropdatabase.studyhub.answer.domain;

import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.quiz.domain.Quiz;
import com.dropdatabase.studyhub.student.domain.Student;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class Answer {
    private UUID id;
    private Student student;
    private Quiz quiz;
    private Question question;
    private Option option;


    public Answer(Student student, Quiz quiz, Question question, Option option) {
        this.id = UUID.randomUUID();
        this.student = student;
        this.quiz = quiz;
        this.question = question;
        this.option = option;
    }

    public Answer(UUID id,Student student, Quiz quiz, Question question, Option option) {
        this.id = id;
        this.student = student;
        this.quiz = quiz;
        this.question = question;
        this.option = option;
    }
}
