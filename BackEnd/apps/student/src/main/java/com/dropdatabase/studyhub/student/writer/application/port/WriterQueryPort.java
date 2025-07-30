package com.dropdatabase.studyhub.student.writer.application.port;

import com.dropdatabase.studyhub.student.writer.domain.Writer;

import java.util.List;
import java.util.UUID;

public interface WriterQueryPort {
    Writer get(UUID id);
    List<Writer> getAll();
}