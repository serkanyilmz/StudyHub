package com.dropdatabase.studyhub.student.student.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.student.student/infra/out/persistence/StudentJpaAdapter.java

import com.dropdatabase.studyhub.student.student.application.port.StudentQueryPort;
import com.dropdatabase.studyhub.student.student.domain.Student;
import com.dropdatabase.studyhub.student.student.infra.out.jpa.entity.StudentJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class StudentQueryJpaAdapter implements StudentQueryPort {

    private final StudentJpaRepository studentJpaRepository;

    public StudentQueryJpaAdapter(StudentJpaRepository studentJpaRepository) {
        this.studentJpaRepository = studentJpaRepository;
    }

    @Override
    public Student get(UUID id) {
        Optional<StudentJpaEntity> studentJpaEntityOptional = studentJpaRepository.findById(id.toString());
        return studentJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Student> getAll() {
        List<StudentJpaEntity> studentsJpaList = studentJpaRepository.findAll();
        List<Student> students = studentsJpaList.stream()
                .map(StudentJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return students;
    }
}