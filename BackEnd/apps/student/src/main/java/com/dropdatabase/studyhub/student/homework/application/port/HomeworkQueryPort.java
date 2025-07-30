package com.dropdatabase.studyhub.student.homework.application.port;

import com.dropdatabase.studyhub.student.homework.domain.Homework;

import java.util.List;
import java.util.UUID;

public interface HomeworkQueryPort {
    Homework get(UUID id);
    List<Homework> getAll();
}