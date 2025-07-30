package com.dropdatabase.studyhub.student.student.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.student.student/infra/out/persistence/StudentJpaAdapter.java

import com.dropdatabase.studyhub.student.student.application.port.StudentCommandPort;
import com.dropdatabase.studyhub.student.student.domain.Student;
import com.dropdatabase.studyhub.student.student.infra.out.jpa.entity.StudentJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class StudentCommandJpaAdapter implements StudentCommandPort {

    private final StudentJpaRepository studentJpaRepository;

    public StudentCommandJpaAdapter(StudentJpaRepository studentJpaRepository) {
        this.studentJpaRepository = studentJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return studentJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Student get(UUID id) {
        Optional<StudentJpaEntity> studentJpaEntity = studentJpaRepository.findById(id.toString());
        return studentJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Student newStudent) {
        StudentJpaEntity newStudentJpaEntity = new StudentJpaEntity(newStudent);
        StudentJpaEntity savedStudentJpaEntity = studentJpaRepository.save(newStudentJpaEntity);
    }

    @Override
    @Transactional
    public void update(Student updatedStudent) {
        StudentJpaEntity updatedStudentJpaEntity = new StudentJpaEntity(updatedStudent);
        StudentJpaEntity savedStudentJpaEntity = studentJpaRepository.save(updatedStudentJpaEntity);
        savedStudentJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        studentJpaRepository.deleteById(id.toString());
    }

}