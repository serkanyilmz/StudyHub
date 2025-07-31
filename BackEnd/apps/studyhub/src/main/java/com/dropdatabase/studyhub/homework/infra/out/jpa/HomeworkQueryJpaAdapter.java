package com.dropdatabase.studyhub.homework.infra.out.jpa;

import com.dropdatabase.studyhub.homework.application.port.HomeworkQueryPort;
import com.dropdatabase.studyhub.homework.domain.Homework;
import com.dropdatabase.studyhub.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HomeworkQueryJpaAdapter implements HomeworkQueryPort {

    private final HomeworkJpaRepository homeworkJpaRepository;

    public HomeworkQueryJpaAdapter(HomeworkJpaRepository homeworkJpaRepository) {
        this.homeworkJpaRepository = homeworkJpaRepository;
    }

    @Override
    public Homework get(UUID id) {
        Optional<HomeworkJpaEntity> homeworkJpaEntityOptional = homeworkJpaRepository.findById(id.toString());
        return homeworkJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Homework> getAllByClassroomId(UUID classroomId) {
        List<HomeworkJpaEntity> homeworksJpaList = homeworkJpaRepository.findAllByClassroomId(classroomId.toString());
        return homeworksJpaList.stream()
                .map(HomeworkJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
    }
}