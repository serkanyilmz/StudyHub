package com.dropdatabase.studyhub.student.application;

import com.dropdatabase.studyhub.student.application.port.StudentQueryPort;
import com.dropdatabase.studyhub.student.domain.Student;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StudentQueryUseCase {

    private final StudentQueryPort studentQueryPort;

    public StudentQueryUseCase(StudentQueryPort studentQueryPort) {
        this.studentQueryPort = studentQueryPort;
    }

    public List<Student> getAll() {
        return studentQueryPort.getAll();
    }

    public Student get(UUID id) {return studentQueryPort.get(id);
    }
}