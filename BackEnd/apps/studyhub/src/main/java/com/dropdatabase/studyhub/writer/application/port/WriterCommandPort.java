package com.dropdatabase.studyhub.writer.application.port;

import com.dropdatabase.studyhub.auth.domain.model.User;
import com.dropdatabase.studyhub.writer.domain.Writer;

import java.util.UUID;

public interface WriterCommandPort {
    boolean exists(UUID id);
    Writer get(UUID id);
    void add(Writer newWriter);
    void update(Writer updatedWriter);
    void delete(UUID id);
    void saveWriterFromUser(User user);
}