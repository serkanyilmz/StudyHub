package com.dropdatabase.studyhub.question.infra.inp.web;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.question.application.QuestionCommandUseCase;
import com.dropdatabase.studyhub.question.application.command.UpdateQuestionCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.question.application.command.AddQuestionCommand;

import java.util.UUID;

@RestController
@RequestMapping("/question")
public class QuestionCommandController {

    private final QuestionCommandUseCase questionCommandUseCase;

    public QuestionCommandController(QuestionCommandUseCase questionCommandUseCase) {
        this.questionCommandUseCase = questionCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddQuestionCommand addQuestionCommand){
        return questionCommandUseCase.add(addQuestionCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateQuestionCommand updateQuestionCommand){
        return questionCommandUseCase.update(id, updateQuestionCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return questionCommandUseCase.delete(id);
    }
}