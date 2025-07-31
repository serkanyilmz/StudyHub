package com.dropdatabase.studyhub.question.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.option/infra/out/persistence/OptionJpaAdapter.java

import com.dropdatabase.studyhub.question.application.port.OptionCommandPort;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.OptionJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class OptionCommandJpaAdapter implements OptionCommandPort {

    private final OptionJpaRepository optionJpaRepository;

    public OptionCommandJpaAdapter(OptionJpaRepository optionJpaRepository) {
        this.optionJpaRepository = optionJpaRepository;;
    }

    
    @Override
    @Transactional
    public Option get(UUID id) {
        Optional<OptionJpaEntity> optionJpaEntity = optionJpaRepository.findById(id.toString());
        return optionJpaEntity.get().toDomainEntity();
    }
}