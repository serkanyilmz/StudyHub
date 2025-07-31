package com.dropdatabase.studyhub.classroom.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.classroom/infra/out/persistence/ClassroomJpaAdapter.java

import com.dropdatabase.studyhub.classroom.application.port.ClassroomQueryPort;
import com.dropdatabase.studyhub.classroom.domain.Classroom;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ClassroomQueryJpaAdapter implements ClassroomQueryPort {

    private final ClassroomJpaRepository classroomJpaRepository;

    public ClassroomQueryJpaAdapter(ClassroomJpaRepository classroomJpaRepository) {
        this.classroomJpaRepository = classroomJpaRepository;
    }

    @Override
    public Classroom get(UUID id) {
        Optional<ClassroomJpaEntity> classroomJpaEntityOptional = classroomJpaRepository.findById(id.toString());
        return classroomJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Classroom> getAll() {
        List<ClassroomJpaEntity> classroomsJpaList = classroomJpaRepository.findAll();
        List<Classroom> classrooms = classroomsJpaList.stream()
                .map(ClassroomJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return classrooms;
    }

    @Override
    public List<Classroom> getAll(UUID studentId) {
        List<ClassroomJpaEntity> classroomsJpaList = classroomJpaRepository.findAll();
        List<Classroom> classrooms = classroomsJpaList.stream()
                .filter(classroomJpaEntity -> classroomJpaEntity.getStudents().stream()
                        .anyMatch(studentJpaEntity -> studentJpaEntity.getId().equals(studentId.toString())))
                .map(ClassroomJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return classrooms;
}}