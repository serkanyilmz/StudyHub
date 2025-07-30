package com.dropdatabase.studyhub.auth.homework.domain;

import com.dropdatabase.studyhub.auth.classroom.domain.Classroom;
import com.dropdatabase.studyhub.auth.quiz.domain.Quiz;
import lombok.Getter;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
public class Homework {
    private UUID id;
    private String name;
    private List<Quiz> quizzes;
    private Classroom classroom;
    private ZonedDateTime deadline;

    public Homework(String name, List<Quiz> quizzes, Classroom classroom, ZonedDateTime deadline) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.quizzes = quizzes;
        this.classroom = classroom;
        this.deadline = deadline;
    }

    public Homework(UUID id,
                    String name,
                    List<Quiz> quizzes,
                    Classroom classroom,
                    ZonedDateTime deadline) {
        this.id = id;
        this.name = name;
        this.quizzes = quizzes;
        this.classroom = classroom;
        this.deadline = deadline;
    }
}