package com.dropdatabase.studyhub.employee.writer.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.writer/infra/out/persistence/WriterJpaAdapter.java

import com.dropdatabase.studyhub.employee.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.employee.writer.application.port.WriterCommandPort;
import com.dropdatabase.studyhub.employee.writer.domain.Writer;
import com.dropdatabase.studyhub.employee.writer.infra.out.jpa.entity.WriterJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Component
public class WriterCommandJpaAdapter implements WriterCommandPort {

    private final com.dropdatabase.studyhub.employee.writer.infra.out.jpa.WriterJpaRepository writerJpaRepository;

    public WriterCommandJpaAdapter(WriterJpaRepository writerJpaRepository,
                                    ClassroomJpaRepository classroomJpaRepository) {
        this.writerJpaRepository = writerJpaRepository;
    }

    @Override
    public boolean exists(UUID id) {
        return writerJpaRepository.existsById(id.toString());
    }

    @Override
    @Transactional
    public Writer get(UUID id) {
        Optional<WriterJpaEntity> writerJpaEntity = writerJpaRepository.findById(id.toString());
        return writerJpaEntity.get().toDomainEntity();
    }

    @Override
    @Transactional
    public void add(Writer newWriter) {
        WriterJpaEntity newWriterJpaEntity = new WriterJpaEntity(newWriter);
        WriterJpaEntity savedWriterJpaEntity = writerJpaRepository.save(newWriterJpaEntity);
    }

    @Override
    @Transactional
    public void update(Writer updatedWriter) {
        WriterJpaEntity updatedWriterJpaEntity = new WriterJpaEntity(updatedWriter);
        WriterJpaEntity savedWriterJpaEntity = writerJpaRepository.save(updatedWriterJpaEntity);
        savedWriterJpaEntity.toDomainEntity();
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        writerJpaRepository.deleteById(id.toString());
    }

}