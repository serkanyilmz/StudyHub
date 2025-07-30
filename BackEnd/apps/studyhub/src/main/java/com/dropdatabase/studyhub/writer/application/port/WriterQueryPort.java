package com.dropdatabase.studyhub.writer.application.port;

import com.dropdatabase.studyhub.writer.domain.Writer;

import java.util.List;
import java.util.UUID;

public interface WriterQueryPort {
    Writer get(UUID id);
    List<Writer> getAll();
}