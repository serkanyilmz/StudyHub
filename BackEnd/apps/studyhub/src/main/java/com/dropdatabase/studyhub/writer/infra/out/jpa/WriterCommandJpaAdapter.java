package com.dropdatabase.studyhub.writer.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.writer/infra/out/persistence/WriterJpaAdapter.java

import com.dropdatabase.studyhub.auth.application.port.AuthCommandPort;
import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.auth.infra.exception.UserNotFoundException;
import com.dropdatabase.studyhub.auth.infra.out.jpa.entity.UserJpaEntity;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.writer.application.port.WriterCommandPort;
import com.dropdatabase.studyhub.writer.domain.Writer;
import com.dropdatabase.studyhub.writer.infra.out.jpa.entity.WriterJpaEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@Component
public class WriterCommandJpaAdapter implements WriterCommandPort {

    private final WriterJpaRepository writerJpaRepository;
    private final AuthCommandPort authCommandPort;

    public WriterCommandJpaAdapter(WriterJpaRepository writerJpaRepository,
                                    ClassroomJpaRepository classroomJpaRepository, AuthCommandPort authCommandPort) {
        this.writerJpaRepository = writerJpaRepository;
        this.authCommandPort = authCommandPort;
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

    @Override
    public void saveWriterFromUser(User user) {
        String fullName = user.getFullName().trim();
        String[] nameParts = fullName.split("\\s+");

        String firstName;
        String lastName;

        if (nameParts.length == 1) {
            firstName = nameParts[0];
            lastName = "";
        } else {
            lastName = nameParts[nameParts.length - 1];
            firstName = String.join(" ", Arrays.copyOfRange(nameParts, 0, nameParts.length - 1));
        }

        Writer writer = new Writer(
                user.getId(),
                firstName,
                lastName,
                "",
                "",
                LocalDateTime.now()
        );

        WriterJpaEntity entity = new WriterJpaEntity(writer);
        writerJpaRepository.save(entity);
    }

}