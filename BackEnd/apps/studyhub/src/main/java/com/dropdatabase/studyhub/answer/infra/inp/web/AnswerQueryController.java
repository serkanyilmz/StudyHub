package com.dropdatabase.studyhub.answer.infra.inp.web;

import com.dropdatabase.studyhub.writer.application.WriterQueryUseCase;
import com.dropdatabase.studyhub.writer.domain.Writer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/writer")
public class AnswerQueryController {

    private final WriterQueryUseCase writerQueryUseCase;

    public AnswerQueryController(WriterQueryUseCase writerQueryUseCase) {
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