package com.dropdatabase.studyhub.question.infra.inp.web;

import com.dropdatabase.studyhub.question.application.QuestionAIUseCase;
import com.dropdatabase.studyhub.question.application.QuestionQueryUseCase;
import com.dropdatabase.studyhub.question.application.query.QuestionViewModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/question")
public class QuestionAIController {

    private final QuestionAIUseCase questionAIUseCase;

    public QuestionAIController(QuestionAIUseCase questionAIUseCase) {
        this.questionAIUseCase = questionAIUseCase;
        }

    @GetMapping("/getAnswerExplanation/{id}")
    public String getAnswerExplanation(@PathVariable UUID id){
        return questionAIUseCase.getAnswerExplanation(id);
    }

}