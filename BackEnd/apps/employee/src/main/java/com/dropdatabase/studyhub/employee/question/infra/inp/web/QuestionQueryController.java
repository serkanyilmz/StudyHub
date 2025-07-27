package com.dropdatabase.studyhub.employee.question.infra.inp.web;

import com.dropdatabase.studyhub.employee.question.application.QuestionQueryUseCase;
import com.dropdatabase.studyhub.employee.question.domain.Question;
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
    public Question get(@PathVariable UUID id){
        return questionQueryUseCase.get(id);
    }

    @GetMapping
    public List<Question> getAll(){
        return questionQueryUseCase.getAll();
    }
}