package com.dropdatabase.studyhub.answer.application;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.common.MessageType;
import com.dropdatabase.studyhub.answer.application.command.AddAnswerCommand;
import com.dropdatabase.studyhub.answer.application.port.AnswerCommandPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.question.application.port.OptionCommandPort;
import com.dropdatabase.studyhub.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.quiz.application.port.QuizCommandPort;
import com.dropdatabase.studyhub.student.application.port.StudentCommandPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AnswerCommandUseCase {

    private final AnswerCommandPort answerCommandPort;
    private final OptionCommandPort optionCommandPort;
    private final QuizCommandPort quizCommandPort;
    private final StudentCommandPort studentCommandPort;
    private final QuestionCommandPort questionCommandPort;

    public AnswerCommandUseCase(AnswerCommandPort answerCommandPort,
                                StudentCommandPort studentCommandPort,
                                QuizCommandPort quizCommandPort,
                                QuestionCommandPort questionCommandPort,
                                OptionCommandPort optionCommandPort) {
        this.answerCommandPort = answerCommandPort;
        this.studentCommandPort = studentCommandPort;
        this.quizCommandPort = quizCommandPort;
        this.questionCommandPort = questionCommandPort;
        this.optionCommandPort = optionCommandPort;
    }

    @Transactional
    public Answer get(UUID id) {
        return answerCommandPort.get(id);
    }

    @Transactional
    public int submitQuiz(List<AddAnswerCommand> addAnswerCommands, UUID studentId,
                               UUID quizId) {
        var student = studentCommandPort.get(studentId);
        var quiz = quizCommandPort.get(quizId);

        int correct = 0;

        for (AddAnswerCommand addAnswerCommand : addAnswerCommands) {
            Option option = optionCommandPort.get(addAnswerCommand.optionId());
            if (option.isCorrect()){
                correct++;
            }

            Answer newAnswer = new Answer(
                    student,
                    quiz,
                    questionCommandPort.get(addAnswerCommand.questionId()),
                    option
            );
            answerCommandPort.add(newAnswer);
        }
        int questionNumber = quizCommandPort.getQuestionNumber(quizId);
        return (int) ((double) correct / questionNumber * 100);

    }

    public MessageResponse delete(UUID id) {
        if (!answerCommandPort.exists(id)) {
            return new MessageResponse("Answer does not exist", MessageType.ERROR);
        }
        answerCommandPort.delete(id);
        return new MessageResponse("Answer has deleted successfully", MessageType.SUCCESS);
    }
}