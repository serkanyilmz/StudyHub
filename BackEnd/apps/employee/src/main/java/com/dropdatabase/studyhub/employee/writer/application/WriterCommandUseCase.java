package com.dropdatabase.studyhub.employee.writer.application;

import com.dropdatabase.studyhub.employee.common.MessageResponse;
import com.dropdatabase.studyhub.employee.common.MessageType;
import com.dropdatabase.studyhub.employee.writer.application.command.AddWriterCommand;
import com.dropdatabase.studyhub.employee.writer.application.command.UpdateWriterCommand;
import com.dropdatabase.studyhub.employee.writer.application.port.WriterCommandPort;
import com.dropdatabase.studyhub.employee.writer.domain.Writer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class WriterCommandUseCase {

    private final WriterCommandPort writerCommandPort;

    public WriterCommandUseCase(WriterCommandPort writerCommandPort) {
        this.writerCommandPort = writerCommandPort;
    }

    @Transactional
    public Writer get(UUID id) {
        Writer writer = writerCommandPort.get(id);
        return writer;
    }

    @Transactional
    public MessageResponse add(AddWriterCommand addWriterCommand) {
        Writer newWriter = addWriterCommand.toDomainEntity();
        writerCommandPort.add(newWriter);
        return new MessageResponse("Writer has added successfully", MessageType.SUCCESS);
    }

    @Transactional
    public MessageResponse update(UUID id, UpdateWriterCommand updateWriterCommand) {
        if (!writerCommandPort.exists(id)) {
            return new MessageResponse("Writer does not exist", MessageType.ERROR);
        }
        Writer existingWriter = writerCommandPort.get(id);
        Writer updatedWriter = new Writer(existingWriter.getId(),
                updateWriterCommand.firstName(),
                updateWriterCommand.lastName(),
                updateWriterCommand.email(),
                updateWriterCommand.phoneNumber(),
                existingWriter.getRegistrationDate());
        writerCommandPort.update(updatedWriter);
        return new MessageResponse("Writer has updated successfully", MessageType.SUCCESS);
    }

    public MessageResponse delete(UUID id) {
        if (!writerCommandPort.exists(id)) {
            return new MessageResponse("Writer does not exist", MessageType.ERROR);
        }
        writerCommandPort.delete(id);
        return new MessageResponse("Writer has deleted successfully", MessageType.SUCCESS);
    }
}