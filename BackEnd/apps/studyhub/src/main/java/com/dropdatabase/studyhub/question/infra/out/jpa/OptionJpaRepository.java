package com.dropdatabase.studyhub.question.infra.out.jpa;

import com.dropdatabase.studyhub.question.infra.out.jpa.entity.OptionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OptionJpaRepository extends JpaRepository<OptionJpaEntity, Long> {

    Optional<OptionJpaEntity> findById(String id);
}