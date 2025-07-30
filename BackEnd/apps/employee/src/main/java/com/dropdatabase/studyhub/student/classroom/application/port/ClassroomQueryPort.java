package com.dropdatabase.studyhub.student.classroom.application.port;

import com.dropdatabase.studyhub.student.classroom.domain.Classroom;

import java.util.List;
import java.util.UUID;

public interface ClassroomQueryPort {
    Classroom get(UUID id);
    List<Classroom> getAll();
}