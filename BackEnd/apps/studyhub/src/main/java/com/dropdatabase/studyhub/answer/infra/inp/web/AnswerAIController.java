package com.dropdatabase.studyhub.answer.infra.inp.web;

import com.dropdatabase.studyhub.answer.application.AnswerAIUseCase;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/answer")
public class AnswerAIController {
    private final AnswerAIUseCase answerAIUseCase;

    public AnswerAIController(AnswerAIUseCase answerAIUseCase) {
        this.answerAIUseCase = answerAIUseCase;
    }

    @GetMapping("/getStudentProgress/{id}")
    public List<String> getStudentProgress(@PathVariable UUID id){
        return answerAIUseCase.getStudentProgress(id);
    }


}


