package com.dropdatabase.studyhub.auth.writer.application;

import com.dropdatabase.studyhub.auth.writer.application.port.WriterQueryPort;
import com.dropdatabase.studyhub.auth.writer.domain.Writer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WriterQueryUseCase {

    private final WriterQueryPort writerQueryPort;

    public WriterQueryUseCase(WriterQueryPort writerQueryPort) {
        this.writerQueryPort = writerQueryPort;
    }

    public List<Writer> getAll() {
        return writerQueryPort.getAll();
    }

    public Writer get(UUID id) {return writerQueryPort.get(id);
    }
}