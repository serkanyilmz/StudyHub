package com.dropdatabase.studyhub.auth.classroom.infra.inp.web;

import com.dropdatabase.studyhub.auth.common.MessageResponse;
import com.dropdatabase.studyhub.auth.classroom.application.ClassroomCommandUseCase;
import com.dropdatabase.studyhub.auth.classroom.application.command.UpdateClassroomCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.auth.classroom.application.command.AddClassroomCommand;

import java.util.UUID;

@RestController
@RequestMapping("/classroom")
public class ClassroomCommandController {

    private final ClassroomCommandUseCase classroomCommandUseCase;

    public ClassroomCommandController(ClassroomCommandUseCase classroomCommandUseCase) {
        this.classroomCommandUseCase = classroomCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddClassroomCommand addClassroomCommand){
        return classroomCommandUseCase.add(addClassroomCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateClassroomCommand updateClassroomCommand){
        return classroomCommandUseCase.update(id, updateClassroomCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return classroomCommandUseCase.delete(id);
    }
}