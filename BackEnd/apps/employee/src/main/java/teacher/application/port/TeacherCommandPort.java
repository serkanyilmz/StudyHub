package teacher.application.port;

import teacher.domain.Teacher;

import java.util.UUID;

public interface TeacherCommandPort {
    Teacher get(UUID id);
    Teacher add(Teacher newTeacher);
    Teacher update(Teacher updatedTeacher);
}