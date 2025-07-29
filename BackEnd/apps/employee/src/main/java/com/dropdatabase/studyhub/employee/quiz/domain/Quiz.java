package com.dropdatabase.studyhub.employee.quiz.domain;

import com.dropdatabase.studyhub.employee.topic.domain.Topic;
import com.dropdatabase.studyhub.employee.writer.domain.Writer;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class Quiz {
    private UUID id;
    private List<QuizQuestion> questions;
    private Topic topic;
    private Writer writer;

    public Quiz(List<QuizQuestion> questions, Topic topic, Writer writer) {
        this.id = UUID.randomUUID();
        this.questions = questions;
        this.topic = topic;
        this.writer = writer;
    }

    public Quiz(UUID id,
                List<QuizQuestion> questions,
                Topic topic,
                Writer writer) {
        this.id = id;
        this.questions = questions;
        this.topic = topic;
        this.writer = writer;
    }
}