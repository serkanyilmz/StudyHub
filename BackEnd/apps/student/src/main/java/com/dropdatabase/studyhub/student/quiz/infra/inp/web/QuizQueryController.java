package com.dropdatabase.studyhub.student.quiz.infra.inp.web;

import com.dropdatabase.studyhub.student.quiz.application.QuizQueryUseCase;
import com.dropdatabase.studyhub.student.quiz.domain.Quiz;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/quiz")
public class QuizQueryController {

    private final QuizQueryUseCase quizQueryUseCase;

    public QuizQueryController(QuizQueryUseCase quizQueryUseCase) {
        this.quizQueryUseCase = quizQueryUseCase;
    }

    @GetMapping("/{id}")
    public Quiz get(@PathVariable UUID id){
        return quizQueryUseCase.get(id);
    }

    @GetMapping
    public List<Quiz> getAll(){
        return quizQueryUseCase.getAll();
    }
}