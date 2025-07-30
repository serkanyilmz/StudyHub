package com.dropdatabase.studyhub.auth.classroom.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.classroom/infra/out/persistence/ClassroomJpaAdapter.java

import com.dropdatabase.studyhub.auth.classroom.application.port.ClassroomCommandPort;
import com.dropdatabase.studyhub.auth.classroom.domain.Classroom;
import com.dropdatabase.studyhub.auth.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class ClassroomCommandJpaAdapter implements ClassroomCommandPort {

    private final ClassroomJpaRepository classroomJpaRepository;

    public ClassroomCommandJpaAdapter(ClassroomJpaRepository classroomJpaRepository) {
        this.classroomJpaRepository = classroomJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return classroomJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Classroom get(UUID id) {
        Optional<ClassroomJpaEntity> classroomJpaEntity = classroomJpaRepository.findById(id.toString());
        return classroomJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Classroom newClassroom) {
        ClassroomJpaEntity newClassroomJpaEntity = new ClassroomJpaEntity(newClassroom);
        ClassroomJpaEntity savedClassroomJpaEntity = classroomJpaRepository.save(newClassroomJpaEntity);
    }

    @Override
    @Transactional
    public void update(Classroom updatedClassroom) {
        ClassroomJpaEntity updatedClassroomJpaEntity = new ClassroomJpaEntity(updatedClassroom);
        ClassroomJpaEntity savedClassroomJpaEntity = classroomJpaRepository.save(updatedClassroomJpaEntity);
        savedClassroomJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        classroomJpaRepository.deleteById(id.toString());
    }
}