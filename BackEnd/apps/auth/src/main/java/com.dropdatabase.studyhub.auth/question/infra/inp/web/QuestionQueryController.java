package com.dropdatabase.studyhub.auth.question.infra.inp.web;

import com.dropdatabase.studyhub.auth.question.application.QuestionQueryUseCase;
import com.dropdatabase.studyhub.auth.question.application.query.QuestionViewModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/question")
public class QuestionQueryController {

    private final QuestionQueryUseCase questionQueryUseCase;

    public QuestionQueryController(QuestionQueryUseCase questionQueryUseCase) {
        this.questionQueryUseCase = questionQueryUseCase;
    }

    @GetMapping("/{id}")
    public QuestionViewModel get(@PathVariable UUID id){
        return questionQueryUseCase.get(id);
    }

    @GetMapping
    public List<QuestionViewModel> getAll(){
        return questionQueryUseCase.getAll();
    }
}