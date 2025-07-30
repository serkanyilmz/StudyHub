package com.dropdatabase.studyhub.topic.infra.out.jpa;

import com.dropdatabase.studyhub.topic.infra.out.jpa.entity.TopicJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository; // JpaRepository'yi import edin
import org.springframework.stereotype.Repository; // @Repository anotasyonunu import edin

import java.util.Optional;

@Repository
public interface TopicJpaRepository extends JpaRepository<TopicJpaEntity, Long> {

    Optional<TopicJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}