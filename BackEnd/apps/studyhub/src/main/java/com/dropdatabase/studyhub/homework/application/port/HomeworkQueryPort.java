package com.dropdatabase.studyhub.homework.application.port;

import com.dropdatabase.studyhub.homework.domain.Homework;

import java.util.List;
import java.util.UUID;

public interface HomeworkQueryPort {
    Homework get(UUID id);
    List<Homework> getAllByClassroomId(UUID classroomId);
}