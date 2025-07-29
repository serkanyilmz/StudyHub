package com.dropdatabase.studyhub.employee.homework.infra.inp.web;

import com.dropdatabase.studyhub.employee.homework.application.HomeworkQueryUseCase;
import com.dropdatabase.studyhub.employee.homework.domain.Homework;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/homework")
public class HomeworkQueryController {

    private final HomeworkQueryUseCase homeworkQueryUseCase;

    public HomeworkQueryController(HomeworkQueryUseCase homeworkQueryUseCase) {
        this.homeworkQueryUseCase = homeworkQueryUseCase;
    }

    @GetMapping("/{id}")
    public Homework get(@PathVariable UUID id){
        return homeworkQueryUseCase.get(id);
    }

    @GetMapping
    public List<Homework> getAll(){
        return homeworkQueryUseCase.getAll();
    }
}