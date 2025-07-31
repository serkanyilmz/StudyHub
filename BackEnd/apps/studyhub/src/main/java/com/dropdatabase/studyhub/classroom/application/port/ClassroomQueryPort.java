package com.dropdatabase.studyhub.classroom.application.port;

import com.dropdatabase.studyhub.classroom.domain.Classroom;

import java.util.List;
import java.util.UUID;

public interface ClassroomQueryPort {
    Classroom get(UUID id);
    List<Classroom> getAll();
    List<Classroom> getAll(UUID studentId);
}