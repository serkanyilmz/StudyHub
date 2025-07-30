package com.dropdatabase.studyhub.auth.teacher.application;

import com.dropdatabase.studyhub.auth.common.MessageResponse;
import com.dropdatabase.studyhub.auth.common.MessageType;
import com.dropdatabase.studyhub.auth.teacher.application.command.AddTeacherCommand;
import com.dropdatabase.studyhub.auth.teacher.application.command.UpdateTeacherCommand;
import com.dropdatabase.studyhub.auth.teacher.application.port.TeacherCommandPort;
import com.dropdatabase.studyhub.auth.teacher.domain.Teacher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TeacherCommandUseCase {

    private final TeacherCommandPort teacherCommandPort;

    public TeacherCommandUseCase(TeacherCommandPort teacherCommandPort) {
        this.teacherCommandPort = teacherCommandPort;
    }

    @Transactional
    public Teacher get(UUID id) {
        Teacher teacher = teacherCommandPort.get(id);
        return teacher;
    }

    @Transactional
    public MessageResponse add(AddTeacherCommand addTeacherCommand) {
        Teacher newTeacher = addTeacherCommand.toDomainEntity();
        teacherCommandPort.add(newTeacher);
        return new MessageResponse("Teacher has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateTeacherCommand updateTeacherCommand) {
        if (!teacherCommandPort.exists(id)) {
            return new MessageResponse("Teacher does not exist", MessageType.ERROR);
        }
        Teacher existingTeacher = teacherCommandPort.get(id);
        Teacher updatedTeacher = new Teacher(existingTeacher.getId(),
                updateTeacherCommand.firstName(),
                updateTeacherCommand.lastName(),
                updateTeacherCommand.email(),
                updateTeacherCommand.phoneNumber(),
                existingTeacher.getRegistrationDate());
        teacherCommandPort.update(updatedTeacher);
        return new MessageResponse("Teacher has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!teacherCommandPort.exists(id)) {
            return new MessageResponse("Teacher does not exist", MessageType.ERROR);
        }
        if (teacherCommandPort.hasClassroom(id)) {
            return new MessageResponse("Teacher cannot be deleted because of having classrooms", MessageType.ERROR);
        }
        teacherCommandPort.delete(id);
        return new MessageResponse("Teacher has deleted successfully", MessageType.SUCCESS);
    }
}