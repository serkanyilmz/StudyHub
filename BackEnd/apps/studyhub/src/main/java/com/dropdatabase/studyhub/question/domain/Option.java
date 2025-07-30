package com.dropdatabase.studyhub.question.domain;

import com.dropdatabase.studyhub.question.application.query.OptionViewModel;
import lombok.Getter;
import java.util.UUID;

@Getter
public class Option {
    private UUID id;
    private String text;
    private boolean isCorrect;

    public Option(String text, boolean isCorrect) {
        this.id = UUID.randomUUID();
        this.text = text;
        this.isCorrect = isCorrect;
    }

    public Option(UUID id, String text, boolean isCorrect) {
        this.id = id;
        this.text = text;
        this.isCorrect = isCorrect;
    }

    public OptionViewModel toViewModel(){
        return new OptionViewModel(
                this.id,
                this.text,
                this.isCorrect
        );
    }
}