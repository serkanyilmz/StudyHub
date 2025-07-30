package com.dropdatabase.studyhub.auth.homework.application;

import com.dropdatabase.studyhub.auth.classroom.application.port.ClassroomCommandPort;
import com.dropdatabase.studyhub.auth.common.MessageResponse;
import com.dropdatabase.studyhub.auth.common.MessageType;
import com.dropdatabase.studyhub.auth.homework.application.command.AddHomeworkCommand;
import com.dropdatabase.studyhub.auth.homework.application.command.UpdateHomeworkCommand;
import com.dropdatabase.studyhub.auth.homework.application.port.HomeworkCommandPort;
import com.dropdatabase.studyhub.auth.homework.domain.Homework;
import com.dropdatabase.studyhub.auth.quiz.application.port.QuizCommandPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class HomeworkCommandUseCase {

    private final HomeworkCommandPort homeworkCommandPort;
    private final ClassroomCommandPort classroomCommandPort;
    private final QuizCommandPort quizCommandPort;

    public HomeworkCommandUseCase(HomeworkCommandPort homeworkCommandPort,
                                  ClassroomCommandPort classroomCommandPort,
                                  QuizCommandPort quizCommandPort) {
        this.homeworkCommandPort = homeworkCommandPort;
        this.classroomCommandPort = classroomCommandPort;
        this.quizCommandPort = quizCommandPort;
    }

    @Transactional
    public Homework get(UUID id) {
        return homeworkCommandPort.get(id);
    }

    @Transactional
    public MessageResponse add(AddHomeworkCommand addHomeworkCommand) {
        Homework newHomework = new Homework(addHomeworkCommand.name(),
                addHomeworkCommand.quizIdList().stream()
                        .map(quizCommandPort::get)
                        .toList(),
                classroomCommandPort.get(addHomeworkCommand.classroomId()),
                addHomeworkCommand.deadline());
        homeworkCommandPort.add(newHomework);
        return new MessageResponse("Homework has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateHomeworkCommand updateHomeworkCommand) {
        Homework updatedHomework = new Homework(id,
                updateHomeworkCommand.name(),
                updateHomeworkCommand.quizIdList().stream()
                        .map(quizCommandPort::get)
                        .toList(),
                classroomCommandPort.get(updateHomeworkCommand.classroomId()),
                updateHomeworkCommand.deadline());
        homeworkCommandPort.update(updatedHomework);
        return new MessageResponse("Homework has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!homeworkCommandPort.exists(id)) {
            return new MessageResponse("Homework does not exist", MessageType.ERROR);
        }
        homeworkCommandPort.delete(id);
        return new MessageResponse("Homework has deleted successfully", MessageType.SUCCESS);
    }
}