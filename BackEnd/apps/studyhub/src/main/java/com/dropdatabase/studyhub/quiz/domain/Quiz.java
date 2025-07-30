package com.dropdatabase.studyhub.quiz.domain;

import com.dropdatabase.studyhub.topic.domain.Topic;
import com.dropdatabase.studyhub.writer.domain.Writer;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class Quiz {
    private UUID id;
    private String name;
    private List<QuizQuestion> questions;
    private Topic topic;
    private Writer writer;

    public Quiz(String name, List<QuizQuestion> questions, Topic topic, Writer writer) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.questions = questions;
        this.topic = topic;
        this.writer = writer;
    }

    public Quiz(UUID id,
                String name,
                List<QuizQuestion> questions,
                Topic topic,
                Writer writer) {
        this.id = id;
        this.name = name;
        this.questions = questions;
        this.topic = topic;
        this.writer = writer;
    }
}