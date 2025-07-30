package com.dropdatabase.studyhub.student.classroom.application.port;

import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import com.dropdatabase.studyhub.student.student.domain.Student;

import java.util.UUID;

public interface ClassroomCommandPort {
    boolean exists(UUID id);
    Classroom get(UUID id);
    void add(Classroom newClassroom);
    void delete(UUID id);
    void addStudent(UUID classroomId, UUID studentId);
}