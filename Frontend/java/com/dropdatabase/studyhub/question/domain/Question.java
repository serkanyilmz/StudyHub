package com.dropdatabase.studyhub.question.domain;

import com.dropdatabase.studyhub.question.application.query.QuestionViewModel;
import com.dropdatabase.studyhub.topic.domain.Topic;
import com.dropdatabase.studyhub.writer.domain.Writer;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
public class Question {
    private UUID id;
    private String text;
    private List<Option> options;
    private Topic topic;
    private Writer writer;

    public Question(String text, Topic topic, Writer writer) {
        this.id = UUID.randomUUID();
        this.text = text;
        this.options = new ArrayList<>();
        this.topic = topic;
        this.writer = writer;
    }

    public Question(UUID id, String text, Topic topic, Writer writer) {
        this.id = id;
        this.text = text;
        this.options = new ArrayList<>();
        this.topic = topic;
        this.writer = writer;
    }

    public Question(UUID id, String text, List<Option> options, Topic topic, Writer writer) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.topic = topic;
        this.writer = writer;
    }

    public QuestionViewModel toViewModel(){
        return new QuestionViewModel(
                this.id,
                this.text,
                this.options.stream()
                        .map(Option::toViewModel)
                        .collect(Collectors.toList())
        );
    }

}
