package com.dropdatabase.studyhub.student.application.port;

import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.student.domain.Student;

import java.util.UUID;

public interface StudentCommandPort {
    boolean exists(UUID id);
    Student get(UUID id);
    void add(Student newStudent);
    void update(Student updatedStudent);
    void delete(UUID id);
    void saveStudentFromUser(User user);
}