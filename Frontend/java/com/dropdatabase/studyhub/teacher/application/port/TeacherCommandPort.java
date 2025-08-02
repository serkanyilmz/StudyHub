package com.dropdatabase.studyhub.teacher.application.port;

import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.teacher.domain.Teacher;

import java.util.UUID;

public interface TeacherCommandPort {
    boolean exists(UUID id);
    Teacher get(UUID id);
    void add(Teacher newTeacher);
    void update(Teacher updatedTeacher);
    void delete(UUID id);
    boolean hasClassroom(UUID id);
    void saveTeacherFromUser(User user);
}
