package com.dropdatabase.studyhub.teacher.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.teacher/infra/out/persistence/TeacherJpaAdapter.java

import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.teacher.application.port.TeacherCommandPort;
import com.dropdatabase.studyhub.teacher.domain.Teacher;
import com.dropdatabase.studyhub.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
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

    @Override
    public void saveTeacherFromUser(User user) {
        String fullName = user.getFullName().trim();
        String[] nameParts = fullName.split("\\s+");

        String firstName;
        String lastName;

        if (nameParts.length == 1) {
            firstName = nameParts[0];
            lastName = "";
        } else {
            lastName = nameParts[nameParts.length - 1];
            firstName = String.join(" ", Arrays.copyOfRange(nameParts, 0, nameParts.length - 1));
        }

        Teacher teacher = new Teacher(
                user.getId(),
                firstName,
                lastName,
                "",
                "",
                LocalDateTime.now()
        );

        TeacherJpaEntity entity = new TeacherJpaEntity(teacher);
        teacherJpaRepository.save(entity);
    }
}