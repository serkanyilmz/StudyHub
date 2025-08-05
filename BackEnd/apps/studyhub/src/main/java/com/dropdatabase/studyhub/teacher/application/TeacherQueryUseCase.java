package com.dropdatabase.studyhub.teacher.application;

import com.dropdatabase.studyhub.teacher.application.command.AddTeacherCommand;
import com.dropdatabase.studyhub.teacher.application.port.TeacherQueryPort;
import com.dropdatabase.studyhub.teacher.domain.Teacher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TeacherQueryUseCase {

    private final TeacherQueryPort teacherQueryPort;

    public TeacherQueryUseCase(TeacherQueryPort teacherQueryPort) {
        this.teacherQueryPort = teacherQueryPort;
    }

    public List<Teacher> getAll() {
        return teacherQueryPort.getAll();
    }

    public Teacher get(UUID id) {return teacherQueryPort.get(id);
    }

    public int getUniqueStudentsCount(UUID teacherId) {
        return teacherQueryPort.getUniqueStudentsCount(teacherId);
    }

    public AddTeacherCommand.ClassroomStatsCommand getClassroomStats(UUID teacherId, UUID classroomId) {
        return teacherQueryPort.getClassroomStats(teacherId, classroomId);
    }
}