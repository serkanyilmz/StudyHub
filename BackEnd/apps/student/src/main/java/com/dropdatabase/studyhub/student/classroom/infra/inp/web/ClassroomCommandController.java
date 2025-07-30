package com.dropdatabase.studyhub.student.classroom.infra.inp.web;

import com.dropdatabase.studyhub.student.common.MessageResponse;
import com.dropdatabase.studyhub.student.classroom.application.ClassroomCommandUseCase;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.student.classroom.application.command.AddClassroomCommand;

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

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return classroomCommandUseCase.delete(id);
    }

    @PostMapping("/{classroomId}/addStudent")
    public MessageResponse addStudent(@PathVariable UUID classroomId,
                                      @RequestParam UUID studentId){
        return classroomCommandUseCase.addStudent(classroomId,studentId);
    }
}