package com.dropdatabase.studyhub.question.application.port;

import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.topic.domain.Topic;

import java.util.UUID;

public interface QuestionAIPort {
    String getAnswerExplanation(Question question);

    Question getSampleQuestion(Topic topic);
}