package com.dropdatabase.studyhub.employee.classroom.application.port;

import com.dropdatabase.studyhub.employee.classroom.domain.Classroom;

import java.util.List;
import java.util.UUID;

public interface ClassroomQueryPort {
    Classroom get(UUID id);
    List<Classroom> getAll();
}