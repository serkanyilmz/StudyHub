package com.dropdatabase.studyhub.student.classroom.application;

import com.dropdatabase.studyhub.student.common.MessageResponse;
import com.dropdatabase.studyhub.student.common.MessageType;
import com.dropdatabase.studyhub.student.classroom.application.command.AddClassroomCommand;
import com.dropdatabase.studyhub.student.classroom.application.port.ClassroomCommandPort;
import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import com.dropdatabase.studyhub.student.teacher.application.port.TeacherCommandPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ClassroomCommandUseCase {

    private final ClassroomCommandPort classroomCommandPort;
    private final TeacherCommandPort teacherCommandPort;

    public ClassroomCommandUseCase(ClassroomCommandPort classroomCommandPort,
                                   TeacherCommandPort teacherCommandPort) {
        this.classroomCommandPort = classroomCommandPort;
        this.teacherCommandPort = teacherCommandPort;

    }

    @Transactional
    public Classroom get(UUID id) {
        Classroom classroom = classroomCommandPort.get(id);
        return classroom;
    }

    // TODO: teacherId will be get by security app
    @Transactional
    public MessageResponse add(AddClassroomCommand addClassroomCommand) {
        Classroom newClassroom = new Classroom(
                addClassroomCommand.code(),
                addClassroomCommand.name(),
                teacherCommandPort.get(addClassroomCommand.teacherId())
        );
        classroomCommandPort.add(newClassroom);
        return new MessageResponse("Classroom has added successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!classroomCommandPort.exists(id)) {
            return new MessageResponse("Classroom does not exist", MessageType.ERROR);
        }

        classroomCommandPort.delete(id);
        return new MessageResponse("Classroom has deleted successfully", MessageType.SUCCESS);
    }

    public MessageResponse addStudent(UUID classroomId, UUID studentId) {
        classroomCommandPort.addStudent(classroomId, studentId);
        return new MessageResponse("You are added to classroom", MessageType.SUCCESS);
    }
}