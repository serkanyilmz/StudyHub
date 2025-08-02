package com.dropdatabase.studyhub.classroom.application;

import com.dropdatabase.studyhub.classroom.application.port.ClassroomQueryPort;
import com.dropdatabase.studyhub.classroom.domain.Classroom;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ClassroomQueryUseCase {

    private final ClassroomQueryPort classroomQueryPort;

    public ClassroomQueryUseCase(ClassroomQueryPort classroomQueryPort) {
        this.classroomQueryPort = classroomQueryPort;
    }

    public List<Classroom> getAll() {
        return classroomQueryPort.getAll();
    }

    public List<Classroom> getAll(UUID studentId) {
        return classroomQueryPort.getAll(studentId);
    }

    public Classroom get(UUID id) {return classroomQueryPort.get(id);
    }
}
