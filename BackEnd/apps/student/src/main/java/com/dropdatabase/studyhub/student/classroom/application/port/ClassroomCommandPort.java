package com.dropdatabase.studyhub.student.classroom.application.port;

import com.dropdatabase.studyhub.student.classroom.domain.Classroom;

import java.util.UUID;

public interface ClassroomCommandPort {
    boolean exists(UUID id);
    Classroom get(UUID id);
    void add(Classroom newClassroom);
    void update(Classroom updatedClassroom);
    void delete(UUID id);
}