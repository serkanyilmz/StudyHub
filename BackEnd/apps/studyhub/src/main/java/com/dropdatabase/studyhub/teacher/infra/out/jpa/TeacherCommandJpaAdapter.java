package com.dropdatabase.studyhub.teacher.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.teacher/infra/out/persistence/TeacherJpaAdapter.java

import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.teacher.application.port.TeacherCommandPort;
import com.dropdatabase.studyhub.teacher.domain.Teacher;
import com.dropdatabase.studyhub.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class TeacherCommandJpaAdapter implements TeacherCommandPort {

    private final TeacherJpaRepository teacherJpaRepository;
    private final ClassroomJpaRepository classroomJpaRepository;

    public TeacherCommandJpaAdapter(TeacherJpaRepository teacherJpaRepository,
                                    ClassroomJpaRepository classroomJpaRepository) {
        this.teacherJpaRepository = teacherJpaRepository;
        this.classroomJpaRepository = classroomJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return teacherJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Teacher get(UUID id) {
        Optional<TeacherJpaEntity> teacherJpaEntity = teacherJpaRepository.findById(id.toString());
        return teacherJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Teacher newTeacher) {
        TeacherJpaEntity newTeacherJpaEntity = new TeacherJpaEntity(newTeacher);
        TeacherJpaEntity savedTeacherJpaEntity = teacherJpaRepository.save(newTeacherJpaEntity);
    }

    @Override
    @Transactional
    public void update(Teacher updatedTeacher) {
        TeacherJpaEntity updatedTeacherJpaEntity = new TeacherJpaEntity(updatedTeacher);
        TeacherJpaEntity savedTeacherJpaEntity = teacherJpaRepository.save(updatedTeacherJpaEntity);
        savedTeacherJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        teacherJpaRepository.deleteById(id.toString());
    }

    @Override
    public boolean hasClassroom(UUID id) {
        return classroomJpaRepository.existsByTeacherId(id.toString());
    }
}