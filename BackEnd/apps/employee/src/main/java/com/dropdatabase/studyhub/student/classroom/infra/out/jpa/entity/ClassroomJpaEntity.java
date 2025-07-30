package com.dropdatabase.studyhub.student.classroom.infra.out.jpa.entity;
import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import com.dropdatabase.studyhub.student.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "classroom")
@NoArgsConstructor
public class ClassroomJpaEntity {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "code", unique = true, nullable = false)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "teacher_id", referencedColumnName = "id", nullable = false)
    private TeacherJpaEntity teacher;

    public ClassroomJpaEntity(Classroom classroom) {
        this.id = classroom.getId().toString();
        this.code = classroom.getCode();
        this.name = classroom.getName();
        this.teacher = new TeacherJpaEntity(classroom.getTeacher());
    }

    public Classroom toDomainEntity() {
        return new Classroom(
                UUID.fromString(id),
                this.code,
                this.name,
                this.teacher.toDomainEntity()
        );
    }
}