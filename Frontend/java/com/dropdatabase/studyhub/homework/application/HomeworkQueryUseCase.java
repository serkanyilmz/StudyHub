package com.dropdatabase.studyhub.homework.application;

import com.dropdatabase.studyhub.auth.application.AuthQueryUseCase;
import com.dropdatabase.studyhub.homework.application.port.HomeworkQueryPort;
import com.dropdatabase.studyhub.homework.domain.Homework;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HomeworkQueryUseCase {

    private final HomeworkQueryPort homeworkQueryPort;

    public HomeworkQueryUseCase(HomeworkQueryPort homeworkQueryPort) {
        this.homeworkQueryPort = homeworkQueryPort;
    }

    public List<Homework> getAllByClassroomId(UUID classroomId) {
        return homeworkQueryPort.getAllByClassroomId(classroomId);
    }

    public Homework get(UUID id) {return homeworkQueryPort.get(id);
    }
}
