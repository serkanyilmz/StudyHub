package com.dropdatabase.studyhub.student.application;

import com.dropdatabase.studyhub.student.common.MessageResponse;
import com.dropdatabase.studyhub.student.common.MessageType;
import com.dropdatabase.studyhub.student.student.application.command.AddStudentCommand;
import com.dropdatabase.studyhub.student.student.application.command.UpdateStudentCommand;
import com.dropdatabase.studyhub.student.student.application.port.StudentCommandPort;
import com.dropdatabase.studyhub.student.student.domain.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class StudentCommandUseCase {

    private final StudentCommandPort studentCommandPort;

    public StudentCommandUseCase(StudentCommandPort studentCommandPort) {
        this.studentCommandPort = studentCommandPort;
    }

    @Transactional
    public Student get(UUID id) {
        Student student = studentCommandPort.get(id);
        return student;
    }

    @Transactional
    public MessageResponse add(AddStudentCommand addStudentCommand) {
        Student newStudent = addStudentCommand.toDomainEntity();
        studentCommandPort.add(newStudent);
        return new MessageResponse("Student has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateStudentCommand updateStudentCommand) {
        if (!studentCommandPort.exists(id)) {
            return new MessageResponse("Student does not exist", MessageType.ERROR);
        }
        Student existingStudent = studentCommandPort.get(id);
        Student updatedStudent = new Student(existingStudent.getId(),
                updateStudentCommand.firstName(),
                updateStudentCommand.lastName(),
                updateStudentCommand.email(),
                updateStudentCommand.phoneNumber(),
                existingStudent.getRegistrationDate());
        studentCommandPort.update(updatedStudent);
        return new MessageResponse("Student has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!studentCommandPort.exists(id)) {
            return new MessageResponse("Student does not exist", MessageType.ERROR);
        }
        studentCommandPort.delete(id);
        return new MessageResponse("Student has deleted successfully", MessageType.SUCCESS);
    }
}