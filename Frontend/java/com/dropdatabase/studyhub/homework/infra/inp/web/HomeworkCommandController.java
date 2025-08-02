package com.dropdatabase.studyhub.homework.infra.inp.web;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.homework.application.HomeworkCommandUseCase;
import com.dropdatabase.studyhub.homework.application.command.UpdateHomeworkCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.homework.application.command.AddHomeworkCommand;

import java.util.UUID;

@RestController
@RequestMapping("/homework")
public class HomeworkCommandController {

    private final HomeworkCommandUseCase homeworkCommandUseCase;

    public HomeworkCommandController(HomeworkCommandUseCase homeworkCommandUseCase) {
        this.homeworkCommandUseCase = homeworkCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddHomeworkCommand addHomeworkCommand){
        return homeworkCommandUseCase.add(addHomeworkCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateHomeworkCommand updateHomeworkCommand){
        return homeworkCommandUseCase.update(id, updateHomeworkCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return homeworkCommandUseCase.delete(id);
    }
}
