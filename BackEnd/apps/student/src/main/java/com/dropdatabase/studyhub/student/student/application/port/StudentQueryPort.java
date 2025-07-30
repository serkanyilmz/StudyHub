package com.dropdatabase.studyhub.student.student.application.port;

import com.dropdatabase.studyhub.student.student.domain.Student;

import java.util.List;
import java.util.UUID;

public interface StudentQueryPort {
    Student get(UUID id);
    List<Student> getAll();
}