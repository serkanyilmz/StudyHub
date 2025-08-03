package com.dropdatabase.studyhub.answer.infra.inp.web;

import com.dropdatabase.studyhub.answer.application.AnswerQueryUseCase;
import com.dropdatabase.studyhub.answer.domain.Answer;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/answer")
public class AnswerQueryController {

    private final AnswerQueryUseCase answerQueryUseCase;

    public AnswerQueryController(AnswerQueryUseCase answerQueryUseCase) {
        this.answerQueryUseCase = answerQueryUseCase;
    }

    @GetMapping("/{id}")
    public Answer get(@PathVariable UUID id){
        return answerQueryUseCase.get(id);
    }

    @GetMapping
    public List<Answer> getAll(){
        return answerQueryUseCase.getAll();
    }

    @GetMapping("/score")
    public int getQuizScore(@RequestParam UUID studentId, @RequestParam UUID quizId) {
        return answerQueryUseCase.calculateScore(studentId, quizId);
    }
}