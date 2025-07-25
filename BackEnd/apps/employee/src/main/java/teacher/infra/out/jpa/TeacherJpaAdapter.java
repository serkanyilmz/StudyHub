package teacher.infra.out.jpa;// src/main/java/teacher/infra/out/persistence/TeacherJpaAdapter.java

import teacher.application.port.TeacherCommandPort;
import teacher.domain.Teacher;
import teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class TeacherJpaAdapter implements TeacherCommandPort {

    private final TeacherJpaRepository teacherJpaRepository;

    public TeacherJpaAdapter(TeacherJpaRepository teacherJpaRepository) {
        this.teacherJpaRepository = teacherJpaRepository;
    }

    @Override
    @Transactional
    public Teacher get(UUID id) {
        Optional<TeacherJpaEntity> teacherJpaEntity = teacherJpaRepository.findById(id.toString());
        return teacherJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public Teacher add(Teacher newTeacher) {
        TeacherJpaEntity newTeacherJpaEntity = new TeacherJpaEntity(newTeacher);
        TeacherJpaEntity savedTeacherJpaEntity = teacherJpaRepository.save(newTeacherJpaEntity);
        return savedTeacherJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public Teacher update(Teacher updatedTeacher) {
        TeacherJpaEntity updatedTeacherJpaEntity = new TeacherJpaEntity(updatedTeacher);
        TeacherJpaEntity savedTeacherJpaEntity = teacherJpaRepository.save(updatedTeacherJpaEntity);
        return savedTeacherJpaEntity.toDomainEntity();
    }
}