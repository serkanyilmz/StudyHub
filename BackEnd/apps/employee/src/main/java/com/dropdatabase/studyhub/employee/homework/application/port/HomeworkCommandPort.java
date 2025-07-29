package com.dropdatabase.studyhub.employee.homework.application.port;

import com.dropdatabase.studyhub.employee.homework.domain.Homework;

import java.util.UUID;

public interface HomeworkCommandPort {
    boolean exists(UUID id);
    Homework get(UUID id);
    void add(Homework newHomework);
    void update(Homework updatedHomework);
    void delete(UUID id);
}