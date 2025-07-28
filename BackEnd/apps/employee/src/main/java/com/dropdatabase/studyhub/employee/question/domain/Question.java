package com.dropdatabase.studyhub.employee.question.domain;

import com.dropdatabase.studyhub.employee.question.application.query.OptionViewModel;
import com.dropdatabase.studyhub.employee.question.application.query.QuestionViewModel;
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

    public Question(String text) {
        this.id = UUID.randomUUID();
        this.text = text;
        this.options = new ArrayList<>();
    }

    public Question(UUID id, String text) {
        this.id = id;
        this.text = text;
        this.options = new ArrayList<>();
    }

    public Question(UUID id, String text, List<Option> options) {
        this.id = id;
        this.text = text;
        this.options = options;
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