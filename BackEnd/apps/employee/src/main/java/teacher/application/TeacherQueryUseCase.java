package teacher.application;

import teacher.application.port.TeacherQueryPort;
import teacher.domain.Teacher;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherQueryUseCase {

    private final TeacherQueryPort teacherQueryPort;

    public TeacherQueryUseCase(TeacherQueryPort teacherQueryPort) {
        this.teacherQueryPort = teacherQueryPort;
    }

    public List<Teacher> getAll() {
        return teacherQueryPort.getAll();
    }
}