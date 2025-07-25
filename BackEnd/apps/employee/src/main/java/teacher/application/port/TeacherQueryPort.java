package teacher.application.port;

import teacher.domain.Teacher;

import java.util.List;

public interface TeacherQueryPort {
    List<Teacher> getAll();
}