package com.dropdatabase.studyhub.classroom.application.port;

import com.dropdatabase.studyhub.classroom.domain.Classroom;

import java.util.UUID;

public interface ClassroomCommandPort {
    boolean exists(UUID id);
    Classroom get(UUID id);
    void add(Classroom newClassroom);
    void update(Classroom updatedClassroom);
    void delete(UUID id);
    void addStudent(UUID classroomId, UUID studentId);
}
