package com.dropdatabase.studyhub.homework.infra.out.jpa.entity;

import com.dropdatabase.studyhub.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.homework.domain.Homework;
import com.dropdatabase.studyhub.quiz.domain.Quiz;
import com.dropdatabase.studyhub.quiz.infra.out.jpa.entity.QuizJpaEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "homework")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HomeworkJpaEntity {
    @Id
    private String id;

    @Column
    private String name;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "homework_quiz",
            joinColumns = @JoinColumn(name = "homework_id"),
            inverseJoinColumns = @JoinColumn(name = "quiz_id")
    )
    private List<QuizJpaEntity> quizzes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private ClassroomJpaEntity classroom;

    @Column
    private String deadline;

    public HomeworkJpaEntity(Homework homework,
                             ClassroomJpaEntity classroom) {
        this.id = homework.getId().toString();
        this.name = homework.getName();
        this.classroom = classroom;
        this.deadline = homework.getDeadline().toString();
    }

    public Homework toDomainEntity() {
        List<Quiz> quizList = this.quizzes.stream()
                .map(QuizJpaEntity::toDomainEntity)
                .toList();

        return new Homework(
                UUID.fromString(id),
                this.name,
                quizList,
                this.classroom.toDomainEntity(),
                ZonedDateTime.parse(deadline)
        );
    }
}