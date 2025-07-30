package com.dropdatabase.studyhub.student.writer.application.port;

import com.dropdatabase.studyhub.student.writer.domain.Writer;

import java.util.UUID;

public interface WriterCommandPort {
    boolean exists(UUID id);
    Writer get(UUID id);
    void add(Writer newWriter);
    void update(Writer updatedWriter);
    void delete(UUID id);
}