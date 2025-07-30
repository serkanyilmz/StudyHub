package com.dropdatabase.studyhub.auth.classroom.infra.out.jpa;

import com.dropdatabase.studyhub.auth.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository; // JpaRepository'yi import edin
import org.springframework.stereotype.Repository; // @Repository anotasyonunu import edin

import java.util.Optional;

@Repository
public interface ClassroomJpaRepository extends JpaRepository<ClassroomJpaEntity, Long> {

    Optional<ClassroomJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
    boolean existsByTeacherId(String teacher_id);
}