package com.dropdatabase.studyhub.auth.question.application.port;

import com.dropdatabase.studyhub.auth.question.domain.Question;

import java.util.List;
import java.util.UUID;

public interface QuestionQueryPort {
    Question get(UUID id);
    List<Question> getAll();
}