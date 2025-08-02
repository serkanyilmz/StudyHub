package com.dropdatabase.studyhub.answer.infra.inp.web;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.answer.application.AnswerCommandUseCase;
import com.dropdatabase.studyhub.answer.application.command.AddAnswerCommand;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/answer")
public class AnswerCommandController {

    private final AnswerCommandUseCase answerCommandUseCase;

    public AnswerCommandController(AnswerCommandUseCase answerCommandUseCase) {
        this.answerCommandUseCase = answerCommandUseCase;
    }

    @PostMapping
    public int submitQuiz(@RequestBody List<AddAnswerCommand> addAnswerCommands,
                               @RequestParam UUID studentId,
                               @RequestParam UUID quizId) {
        return answerCommandUseCase.submitQuiz(addAnswerCommands, studentId, quizId);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return answerCommandUseCase.delete(id);
    }
}
