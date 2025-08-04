package com.dropdatabase.studyhub.answer.application.port;

import com.dropdatabase.studyhub.answer.domain.Answer;

import java.util.List;
import java.util.UUID;

public interface AnswerQueryPort {
    Answer get(UUID id);
    List<Answer> getAll();
    List<Answer> getAllByStudentId(UUID studentId);
    List<Answer> getStudentAnswersForQuiz(UUID studentId, UUID quizId);
}