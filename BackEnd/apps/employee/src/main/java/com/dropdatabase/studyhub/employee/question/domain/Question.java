package com.dropdatabase.studyhub.employee.question.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

}