package com.dropdatabase.studyhub.auth.classroom.application.port;

import com.dropdatabase.studyhub.auth.classroom.domain.Classroom;

import java.util.List;
import java.util.UUID;

public interface ClassroomQueryPort {
    Classroom get(UUID id);
    List<Classroom> getAll();
}