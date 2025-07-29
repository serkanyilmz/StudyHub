package com.dropdatabase.studyhub.employee.homework.application;

import com.dropdatabase.studyhub.employee.homework.application.port.HomeworkQueryPort;
import com.dropdatabase.studyhub.employee.homework.domain.Homework;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HomeworkQueryUseCase {

    private final HomeworkQueryPort homeworkQueryPort;

    public HomeworkQueryUseCase(HomeworkQueryPort homeworkQueryPort) {
        this.homeworkQueryPort = homeworkQueryPort;
    }

    public List<Homework> getAll() {
        return homeworkQueryPort.getAll();
    }

    public Homework get(UUID id) {return homeworkQueryPort.get(id);
    }
}