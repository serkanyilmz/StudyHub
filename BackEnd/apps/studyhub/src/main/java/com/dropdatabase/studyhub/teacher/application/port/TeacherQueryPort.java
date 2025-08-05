package com.dropdatabase.studyhub.teacher.application.port;

import com.dropdatabase.studyhub.teacher.domain.Teacher;
import com.dropdatabase.studyhub.teacher.application.command.ClassroomStatsCommand;

import java.util.List;
import java.util.UUID;

public interface TeacherQueryPort {
    Teacher get(UUID id);
    List<Teacher> getAll();
    int getUniqueStudentsCount(UUID teacherId);
    ClassroomStatsCommand getClassroomStats(UUID teacherId, UUID classroomId);
}