package com.dropdatabase.studyhub.answer.application.port;

import com.dropdatabase.studyhub.answer.domain.Answer;

import java.util.List;
import java.util.UUID;

public interface AnswerAIPort {
    List<String> getStudentProgress(List<Answer> answers);
}
