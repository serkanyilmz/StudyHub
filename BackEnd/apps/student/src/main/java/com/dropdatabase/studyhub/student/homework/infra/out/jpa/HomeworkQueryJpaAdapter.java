package com.dropdatabase.studyhub.student.homework.infra.out.jpa;

import com.dropdatabase.studyhub.student.homework.application.port.HomeworkQueryPort;
import com.dropdatabase.studyhub.student.homework.domain.Homework;
import com.dropdatabase.studyhub.student.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class HomeworkQueryJpaAdapter implements HomeworkQueryPort {

    private final com.dropdatabase.studyhub.student.homework.infra.out.jpa.HomeworkJpaRepository homeworkJpaRepository;

    public HomeworkQueryJpaAdapter(HomeworkJpaRepository homeworkJpaRepository) {
        this.homeworkJpaRepository = homeworkJpaRepository;
    }

    @Override
    public Homework get(UUID id) {
        Optional<HomeworkJpaEntity> homeworkJpaEntityOptional = homeworkJpaRepository.findById(id.toString());
        return homeworkJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Homework> getAll() {
        List<HomeworkJpaEntity> homeworksJpaList = homeworkJpaRepository.findAll();
        return homeworksJpaList.stream()
                .map(HomeworkJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
    }
}