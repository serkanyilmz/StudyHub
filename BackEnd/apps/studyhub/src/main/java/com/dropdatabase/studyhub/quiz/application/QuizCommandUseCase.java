package com.dropdatabase.studyhub.quiz.application;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.common.MessageType;
import com.dropdatabase.studyhub.question.application.port.QuestionCommandPort;
import com.dropdatabase.studyhub.quiz.application.command.AddQuizCommand;
import com.dropdatabase.studyhub.quiz.application.command.UpdateQuizCommand;
import com.dropdatabase.studyhub.quiz.application.port.QuizCommandPort;
import com.dropdatabase.studyhub.quiz.domain.Quiz;
import com.dropdatabase.studyhub.quiz.domain.QuizQuestion;
import com.dropdatabase.studyhub.topic.application.port.TopicCommandPort;
import com.dropdatabase.studyhub.writer.application.port.WriterCommandPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class QuizCommandUseCase {

    private final QuizCommandPort quizCommandPort;
    private final QuestionCommandPort questionCommandPort;
    private final TopicCommandPort topicCommandPort;
    private final WriterCommandPort writerCommandPort;

    public QuizCommandUseCase(QuizCommandPort quizCommandPort,
                              QuestionCommandPort questionCommandPort,
                              TopicCommandPort topicCommandPort,
                              WriterCommandPort writerCommandPort) {
        this.quizCommandPort = quizCommandPort;
        this.questionCommandPort = questionCommandPort;
        this.topicCommandPort = topicCommandPort;
        this.writerCommandPort = writerCommandPort;
    }

    @Transactional
    public Quiz get(UUID id) {
        return quizCommandPort.get(id);
    }

    @Transactional
    public MessageResponse add(AddQuizCommand addQuizCommand) {
        List<QuizQuestion> quizQuestionList = new ArrayList<>();
        addQuizCommand.quizQuestionCommandList().forEach(quizQuestionCommand -> {
            quizQuestionList.add(
                    new QuizQuestion(
                            questionCommandPort.get(quizQuestionCommand.questionId()),
                            quizQuestionCommand.questionNo()
                    )
            );
        });
        Quiz newQuiz = new Quiz(addQuizCommand.name(),
                quizQuestionList,
                topicCommandPort.get(addQuizCommand.topicId()),
                writerCommandPort.get(addQuizCommand.writerId()));
        quizCommandPort.add(newQuiz);
        return new MessageResponse("Quiz has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateQuizCommand updateQuizCommand) {
        if (!quizCommandPort.exists(id)) {
            return new MessageResponse("Quiz does not exist", MessageType.ERROR);
        }
        Quiz existingQuiz = quizCommandPort.get(id);

        List<QuizQuestion> updatedQuizQuestionList = new ArrayList<>();
        updateQuizCommand.quizQuestionCommandList().forEach(quizQuestionCommand -> {
            updatedQuizQuestionList.add(
                    new QuizQuestion(
                            questionCommandPort.get(quizQuestionCommand.questionId()),
                            quizQuestionCommand.questionNo()
                    )
            );
        });

        Quiz updatedQuiz = new Quiz(existingQuiz.getId(),
                updateQuizCommand.name(),
                updatedQuizQuestionList,
                topicCommandPort.get(updateQuizCommand.topicId()),
                writerCommandPort.get(updateQuizCommand.writerId()));

        quizCommandPort.update(updatedQuiz);
        return new MessageResponse("Quiz has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!quizCommandPort.exists(id)) {
            return new MessageResponse("Quiz does not exist", MessageType.ERROR);
        }
        quizCommandPort.delete(id);
        return new MessageResponse("Quiz has deleted successfully", MessageType.SUCCESS);
    }
}