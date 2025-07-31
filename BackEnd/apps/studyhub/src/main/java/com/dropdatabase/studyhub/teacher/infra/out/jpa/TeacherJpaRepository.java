package com.dropdatabase.studyhub.teacher.infra.out.jpa;

import com.dropdatabase.studyhub.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository; // JpaRepository'yi import edin
import org.springframework.stereotype.Repository; // @Repository anotasyonunu import edin

import java.util.Optional;

@Repository
public interface TeacherJpaRepository extends JpaRepository<TeacherJpaEntity, Long> {

    Optional<TeacherJpaEntity> findById(String id);
    void deleteById(String id);
    boolean existsById(String id);
}