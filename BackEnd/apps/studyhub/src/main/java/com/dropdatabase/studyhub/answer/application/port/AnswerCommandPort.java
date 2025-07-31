package com.dropdatabase.studyhub.answer.application.port;

import com.dropdatabase.studyhub.answer.domain.Answer;

import java.util.UUID;

public interface AnswerCommandPort {
    boolean exists(UUID id);
    Answer get(UUID id);
    void add(Answer answer);
    void delete(UUID id);
}