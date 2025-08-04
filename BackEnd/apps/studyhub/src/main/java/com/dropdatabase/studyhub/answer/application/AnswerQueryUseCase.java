package com.dropdatabase.studyhub.answer.application;

import com.dropdatabase.studyhub.answer.application.port.AnswerQueryPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.quiz.application.port.QuizQueryPort;
import com.dropdatabase.studyhub.quiz.application.port.QuizQuestionQueryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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
        List<Answer> answers = answerQueryPort.findByStudentIdAndQuizId(studentId, quizId);
        int totalQuestions = quizQuestionQueryPort.getQuestionNumber(quizId);
        int correctCount = 0;

        for (Answer answer : answers) {
            if (answer.getOption().isCorrect()) {
                correctCount++;
            }
        }

        if (totalQuestions == 0) return 0;
        System.out.println("correct"+correctCount);
        System.out.println("total"+ totalQuestions);
        System.out.println((int) ((double) correctCount / totalQuestions * 100));

        return (int) ((double) correctCount / totalQuestions * 100);
    }
}