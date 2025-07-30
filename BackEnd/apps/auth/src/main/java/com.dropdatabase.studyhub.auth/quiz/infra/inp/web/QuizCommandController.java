package com.dropdatabase.studyhub.auth.quiz.infra.inp.web;

import com.dropdatabase.studyhub.auth.common.MessageResponse;
import com.dropdatabase.studyhub.auth.quiz.application.QuizCommandUseCase;
import com.dropdatabase.studyhub.auth.quiz.application.command.UpdateQuizCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.auth.quiz.application.command.AddQuizCommand;

import java.util.UUID;

@RestController
@RequestMapping("/quiz")
public class QuizCommandController {

    private final QuizCommandUseCase quizCommandUseCase;

    public QuizCommandController(QuizCommandUseCase quizCommandUseCase) {
        this.quizCommandUseCase = quizCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddQuizCommand addQuizCommand){
        return quizCommandUseCase.add(addQuizCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateQuizCommand updateQuizCommand){
        return quizCommandUseCase.update(id, updateQuizCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return quizCommandUseCase.delete(id);
    }
}