package com.dropdatabase.studyhub.answer.application;

import com.dropdatabase.studyhub.answer.application.port.AnswerQueryPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.quiz.application.port.QuizQueryPort;
import com.dropdatabase.studyhub.quiz.application.port.QuizQuestionQueryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AnswerQueryUseCase {

    private final AnswerQueryPort answerQueryPort;
    private final QuizQuestionQueryPort quizQuestionQueryPort;


    public AnswerQueryUseCase(AnswerQueryPort answerQueryPort,QuizQuestionQueryPort quizQuestionQueryPort) {
        this.answerQueryPort = answerQueryPort;
        this.quizQuestionQueryPort = quizQuestionQueryPort;
    }

    public List<Answer> getAll() {
        return answerQueryPort.getAll();
    }

    public Answer get(UUID id) {return answerQueryPort.get(id);
    }

    public int calculateScore(UUID studentId, UUID quizId) {
        List<Answer> answers = answerQueryPort.getStudentAnswersForQuiz(studentId, quizId);
        int totalQuestions = quizQuestionQueryPort.getQuestionNumber(quizId);
        int correctCount = 0;

        for (Answer answer : answers) {
            if (answer.getOption().isCorrect()) {
                correctCount++;
            }
        }

        if (totalQuestions == 0) return 0;


        return (int) ((double) correctCount / totalQuestions * 100);
    }

        public List<Answer> getStudentAnswersForQuiz(UUID studentId, UUID quizId) {
            return answerQueryPort.getStudentAnswersForQuiz(studentId, quizId);
    }



}