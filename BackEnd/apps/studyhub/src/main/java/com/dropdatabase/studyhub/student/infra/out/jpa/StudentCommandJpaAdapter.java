package com.dropdatabase.studyhub.student.infra.out.jpa;

import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.student.application.port.StudentCommandPort;
import com.dropdatabase.studyhub.student.domain.Student;
import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
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

    @Override
    public void saveStudentFromUser(User user) {
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

        Student student = new Student(
                user.getId(),
                firstName,
                lastName,
                "",
                "",
                LocalDateTime.now()
        );

        StudentJpaEntity entity = new StudentJpaEntity(student);
        studentJpaRepository.save(entity);
    }

}