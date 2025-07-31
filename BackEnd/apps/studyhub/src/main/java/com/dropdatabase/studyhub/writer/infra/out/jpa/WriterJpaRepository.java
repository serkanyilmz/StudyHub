package com.dropdatabase.studyhub.writer.infra.out.jpa;

import com.dropdatabase.studyhub.writer.infra.out.jpa.entity.WriterJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository; // JpaRepository'yi import edin
import org.springframework.stereotype.Repository; // @Repository anotasyonunu import edin

import java.util.Optional;

@Repository
public interface WriterJpaRepository extends JpaRepository<WriterJpaEntity, Long> {

    Optional<WriterJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}