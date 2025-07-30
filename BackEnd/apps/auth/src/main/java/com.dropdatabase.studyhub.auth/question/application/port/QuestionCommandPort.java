package com.dropdatabase.studyhub.auth.question.application.port;

import com.dropdatabase.studyhub.auth.question.domain.Question;

import java.util.UUID;

public interface QuestionCommandPort {
    boolean exists(UUID id);
    Question get(UUID id);
    void add(Question newQuestion);
    void update(Question updatedQuestion);
    void delete(UUID id);
}