package com.dropdatabase.studyhub.writer.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.writer/infra/out/persistence/WriterJpaAdapter.java

import com.dropdatabase.studyhub.writer.application.port.WriterQueryPort;
import com.dropdatabase.studyhub.writer.domain.Writer;
import com.dropdatabase.studyhub.writer.infra.out.jpa.entity.WriterJpaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class WriterQueryJpaAdapter implements WriterQueryPort {

    private final WriterJpaRepository writerJpaRepository;

    public WriterQueryJpaAdapter(WriterJpaRepository writerJpaRepository) {
        this.writerJpaRepository = writerJpaRepository;
    }

    @Override
    public Writer get(UUID id) {
        Optional<WriterJpaEntity> writerJpaEntityOptional = writerJpaRepository.findById(id.toString());
        return writerJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Writer> getAll() {
        List<WriterJpaEntity> writersJpaList = writerJpaRepository.findAll();
        List<Writer> writers = writersJpaList.stream()
                .map(WriterJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return writers;
    }
}