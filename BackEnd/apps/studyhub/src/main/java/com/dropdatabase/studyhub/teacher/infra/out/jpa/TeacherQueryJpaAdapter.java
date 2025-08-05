package com.dropdatabase.studyhub.teacher.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.teacher/infra/out/persistence/TeacherJpaAdapter.java

import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import com.dropdatabase.studyhub.teacher.application.port.TeacherQueryPort;
import com.dropdatabase.studyhub.teacher.domain.Teacher;
import com.dropdatabase.studyhub.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TeacherQueryJpaAdapter implements TeacherQueryPort {

    private final TeacherJpaRepository teacherJpaRepository;
    private final ClassroomJpaRepository classroomJpaRepository;

    public TeacherQueryJpaAdapter(TeacherJpaRepository teacherJpaRepository, ClassroomJpaRepository classroomJpaRepository) {
        this.teacherJpaRepository = teacherJpaRepository;
        this.classroomJpaRepository = classroomJpaRepository;
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

    @Override
    public int getUniqueStudentsCount(UUID teacherId) {
        // Get all classrooms for this teacher
        List<ClassroomJpaEntity> teacherClassrooms = classroomJpaRepository.findAll().stream()
                .filter(classroom -> classroom.getTeacher().getId().equals(teacherId.toString()))
                .collect(Collectors.toList());

        // Use a Set to store unique student IDs
        Set<String> uniqueStudentIds = new HashSet<>();

        // Iterate through all classrooms and add students to the set
        for (ClassroomJpaEntity classroom : teacherClassrooms) {
            for (StudentJpaEntity student : classroom.getStudents()) {
                uniqueStudentIds.add(student.getId());
            }
        }

        return uniqueStudentIds.size();
    }
}