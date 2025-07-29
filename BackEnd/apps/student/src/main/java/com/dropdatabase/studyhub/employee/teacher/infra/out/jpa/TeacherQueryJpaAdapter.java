package com.dropdatabase.studyhub.student.teacher.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.student.teacher/infra/out/persistence/TeacherJpaAdapter.java

import com.dropdatabase.studyhub.student.teacher.application.port.TeacherQueryPort;
import com.dropdatabase.studyhub.student.teacher.domain.Teacher;
import com.dropdatabase.studyhub.student.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TeacherQueryJpaAdapter implements TeacherQueryPort {

    private final TeacherJpaRepository teacherJpaRepository;

    public TeacherQueryJpaAdapter(TeacherJpaRepository teacherJpaRepository) {
        this.teacherJpaRepository = teacherJpaRepository;
    }

    @Override
    public Teacher get(UUID id) {
        Optional<TeacherJpaEntity> teacherJpaEntityOptional = teacherJpaRepository.findById(id.toString());
        return teacherJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Teacher> getAll() {
        List<TeacherJpaEntity> teachersJpaList = teacherJpaRepository.findAll();
        List<Teacher> teachers = teachersJpaList.stream()
                .map(TeacherJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return teachers;
    }
}