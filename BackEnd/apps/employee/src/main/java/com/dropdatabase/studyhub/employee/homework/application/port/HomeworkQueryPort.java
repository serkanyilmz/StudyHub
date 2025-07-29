package com.dropdatabase.studyhub.employee.homework.application.port;

import com.dropdatabase.studyhub.employee.homework.domain.Homework;

import java.util.List;
import java.util.UUID;

public interface HomeworkQueryPort {
    Homework get(UUID id);
    List<Homework> getAll();
}