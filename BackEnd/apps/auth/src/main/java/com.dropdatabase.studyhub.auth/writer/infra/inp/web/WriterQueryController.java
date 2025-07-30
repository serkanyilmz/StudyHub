package com.dropdatabase.studyhub.auth.writer.infra.inp.web;

import com.dropdatabase.studyhub.auth.writer.application.WriterQueryUseCase;
import com.dropdatabase.studyhub.auth.writer.domain.Writer;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/writer")
public class WriterQueryController {

    private final WriterQueryUseCase writerQueryUseCase;

    public WriterQueryController(WriterQueryUseCase writerQueryUseCase) {
        this.writerQueryUseCase = writerQueryUseCase;
    }

    @GetMapping("/{id}")
    public Writer get(@PathVariable UUID id){
        return writerQueryUseCase.get(id);
    }

    @GetMapping
    public List<Writer> getAll(){
        return writerQueryUseCase.getAll();
    }
}