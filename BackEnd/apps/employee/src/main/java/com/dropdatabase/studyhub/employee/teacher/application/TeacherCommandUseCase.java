package com.dropdatabase.studyhub.employee.teacher.application;

import com.dropdatabase.studyhub.employee.teacher.application.command.AddTeacherCommand;
import com.dropdatabase.studyhub.employee.teacher.application.command.UpdateTeacherCommand;
import com.dropdatabase.studyhub.employee.teacher.application.port.TeacherCommandPort;
import com.dropdatabase.studyhub.employee.teacher.domain.Teacher;
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
    public String add(AddTeacherCommand addTeacherCommand) {
        Teacher newTeacher = addTeacherCommand.toDomainEntity();
        teacherCommandPort.add(newTeacher);
        return "Teacher has added successfully";
    }

    @Transactional
    public String update(UUID id, UpdateTeacherCommand updateTeacherCommand) {
        Teacher existingTeacher = teacherCommandPort.get(id);
        Teacher updatedTeacher = new Teacher(existingTeacher.getId(),
                updateTeacherCommand.firstName(),
                updateTeacherCommand.lastName(),
                updateTeacherCommand.email(),
                updateTeacherCommand.phoneNumber(),
                existingTeacher.getRegistrationDate());
        teacherCommandPort.update(updatedTeacher);
        return "Teacher has updated successfully";
    }
}