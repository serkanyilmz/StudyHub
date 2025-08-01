package com.dropdatabase.studyhub.question.application.port;

import com.dropdatabase.studyhub.question.domain.Question;

import java.util.UUID;

public interface QuestionAIPort {
    String getAnswerExplanation(Question question);
}