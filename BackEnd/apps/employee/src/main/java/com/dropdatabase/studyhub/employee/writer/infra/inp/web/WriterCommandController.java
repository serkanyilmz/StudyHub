package com.dropdatabase.studyhub.employee.writer.infra.inp.web;

import com.dropdatabase.studyhub.employee.common.MessageResponse;
import com.dropdatabase.studyhub.employee.writer.application.WriterCommandUseCase;
import com.dropdatabase.studyhub.employee.writer.application.command.UpdateWriterCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.employee.writer.application.command.AddWriterCommand;

import java.util.UUID;

@RestController
@RequestMapping("/writer")
public class WriterCommandController {

    private final WriterCommandUseCase writerCommandUseCase;

    public WriterCommandController(WriterCommandUseCase writerCommandUseCase) {
        this.writerCommandUseCase = writerCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddWriterCommand addWriterCommand){
        return writerCommandUseCase.add(addWriterCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateWriterCommand updateWriterCommand){
        return writerCommandUseCase.update(id, updateWriterCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return writerCommandUseCase.delete(id);
    }
}