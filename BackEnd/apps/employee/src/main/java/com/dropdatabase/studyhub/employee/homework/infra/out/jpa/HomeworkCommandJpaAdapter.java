package com.dropdatabase.studyhub.employee.homework.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.homework/infra/out/persistence/HomeworkJpaAdapter.java

import com.dropdatabase.studyhub.employee.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.employee.homework.application.port.HomeworkCommandPort;
import com.dropdatabase.studyhub.employee.homework.domain.Homework;
import com.dropdatabase.studyhub.employee.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import com.dropdatabase.studyhub.employee.quiz.infra.out.jpa.QuizJpaRepository;
import com.dropdatabase.studyhub.employee.quiz.infra.out.jpa.entity.QuizJpaEntity;
import com.dropdatabase.studyhub.employee.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HomeworkCommandJpaAdapter implements HomeworkCommandPort {

    private final com.dropdatabase.studyhub.employee.homework.infra.out.jpa.HomeworkJpaRepository homeworkJpaRepository;
    private final ClassroomJpaRepository classroomJpaRepository;
    private final QuizJpaRepository quizJpaRepository;

    public HomeworkCommandJpaAdapter(HomeworkJpaRepository homeworkJpaRepository,
                                     ClassroomJpaRepository classroomJpaRepository,
                                     QuizJpaRepository quizJpaRepository) {
        this.homeworkJpaRepository = homeworkJpaRepository;
        this.classroomJpaRepository = classroomJpaRepository;
        this.quizJpaRepository = quizJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return homeworkJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Homework get(UUID id) {
        Optional<HomeworkJpaEntity> homeworkJpaEntity = homeworkJpaRepository.findById(id.toString());
        return homeworkJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Homework newHomework) {
        ClassroomJpaEntity classroom = classroomJpaRepository.findById(newHomework.getClassroom().getId().toString()).get();

        HomeworkJpaEntity newHomeworkJpaEntity = new HomeworkJpaEntity(newHomework, classroom);

        List<QuizJpaEntity> quizJpaEntities = newHomework.getQuizzes().stream()
                .map(quiz -> {
                    return quizJpaRepository.findById(quiz.getId().toString())
                            .orElseThrow(() -> new RuntimeException("Question not found"));
                })
                .collect(Collectors.toList());

        newHomeworkJpaEntity.setQuizzes(quizJpaEntities);

        homeworkJpaRepository.save(newHomeworkJpaEntity);
    }

    @Override
    @Transactional
    public void update(Homework updatedHomework) {
        ClassroomJpaEntity classroom = classroomJpaRepository.findById(updatedHomework.getClassroom().getId().toString()).get();

        HomeworkJpaEntity updatedHomeworkJpaEntity = new HomeworkJpaEntity(updatedHomework, classroom);

        List<QuizJpaEntity> quizJpaEntities = updatedHomework.getQuizzes().stream()
                .map(quiz -> {
                    return quizJpaRepository.findById(quiz.getId().toString())
                            .orElseThrow(() -> new RuntimeException("Question not found"));
                })
                .collect(Collectors.toList());

        updatedHomeworkJpaEntity.setQuizzes(quizJpaEntities);

        homeworkJpaRepository.save(updatedHomeworkJpaEntity);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        homeworkJpaRepository.deleteById(id.toString());
    }

}