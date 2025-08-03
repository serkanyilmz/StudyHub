package com.dropdatabase.studyhub.question.infra.inp.web;

import com.dropdatabase.studyhub.question.application.QuestionAIUseCase;
import com.dropdatabase.studyhub.question.application.QuestionQueryUseCase;
import com.dropdatabase.studyhub.question.application.query.QuestionViewModel;
import com.dropdatabase.studyhub.question.domain.Question;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/question/ai")
public class QuestionAIController {

    private final QuestionAIUseCase questionAIUseCase;

    public QuestionAIController(QuestionAIUseCase questionAIUseCase) {
        this.questionAIUseCase = questionAIUseCase;
        }

    @GetMapping("/getAnswerExplanation/{id}")
    public String getAnswerExplanation(@PathVariable UUID id){
        return questionAIUseCase.getAnswerExplanation(id);
    }

    @GetMapping("/sampleQuestion")
    public Question getSampleQuestion(@RequestParam UUID topicId){
        return questionAIUseCase.getSampleQuestion(topicId);
    }

}