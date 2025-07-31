package com.dropdatabase.studyhub.classroom.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.classroom/infra/out/persistence/ClassroomJpaAdapter.java

import com.dropdatabase.studyhub.classroom.application.port.ClassroomCommandPort;
import com.dropdatabase.studyhub.classroom.domain.Classroom;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.student.infra.out.jpa.StudentJpaRepository;
import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ClassroomCommandJpaAdapter implements ClassroomCommandPort {

    private final ClassroomJpaRepository classroomJpaRepository;
    private final StudentJpaRepository studentJpaRepository;

    public ClassroomCommandJpaAdapter(ClassroomJpaRepository classroomJpaRepository,
                                      StudentJpaRepository studentJpaRepository) {
        this.classroomJpaRepository = classroomJpaRepository;
        this.studentJpaRepository = studentJpaRepository;
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


    @Override
    @Transactional
    public void addStudent(UUID classroomId, UUID studentId) {
        ClassroomJpaEntity classroomJpaEntity = classroomJpaRepository.findById(classroomId.toString()).get();
        StudentJpaEntity studentJpaEntity = studentJpaRepository.findById(studentId.toString()).get();

        List<StudentJpaEntity> studentList = classroomJpaEntity.getStudents();
        studentList.add(studentJpaEntity);
        classroomJpaEntity.setStudents(studentList);

        classroomJpaRepository.save(classroomJpaEntity);
}}