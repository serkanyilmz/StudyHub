package com.dropdatabase.studyhub.student.question.application.port;

import com.dropdatabase.studyhub.student.question.domain.Question;

import java.util.List;
import java.util.UUID;

public interface QuestionQueryPort {
    Question get(UUID id);
    List<Question> getAll();
}