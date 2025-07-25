package teacher.infra.out.jpa;// src/main/java/teacher/infra/out/persistence/TeacherJpaAdapter.java

import teacher.application.port.TeacherQueryPort;
import teacher.domain.Teacher;
import teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TeacherQueryJpaAdapter implements TeacherQueryPort {

    private final TeacherJpaRepository teacherJpaRepository;

    public TeacherQueryJpaAdapter(TeacherJpaRepository teacherJpaRepository) {
        this.teacherJpaRepository = teacherJpaRepository;
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