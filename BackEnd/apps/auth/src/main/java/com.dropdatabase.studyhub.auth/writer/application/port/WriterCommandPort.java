package com.dropdatabase.studyhub.auth.writer.application.port;

import com.dropdatabase.studyhub.auth.writer.domain.Writer;

import java.util.UUID;

public interface WriterCommandPort {
    boolean exists(UUID id);
    Writer get(UUID id);
    void add(Writer newWriter);
    void update(Writer updatedWriter);
    void delete(UUID id);
}