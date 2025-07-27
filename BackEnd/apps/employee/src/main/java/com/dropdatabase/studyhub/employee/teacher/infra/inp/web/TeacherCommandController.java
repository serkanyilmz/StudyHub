package com.dropdatabase.studyhub.employee.teacher.infra.inp.web;

import com.dropdatabase.studyhub.employee.common.MessageResponse;
import com.dropdatabase.studyhub.employee.teacher.application.TeacherCommandUseCase;
import com.dropdatabase.studyhub.employee.teacher.application.command.UpdateTeacherCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.employee.teacher.application.command.AddTeacherCommand;

import java.util.UUID;

@RestController
@RequestMapping("/teacher")
public class TeacherCommandController {

    private final TeacherCommandUseCase teacherCommandUseCase;

    public TeacherCommandController(TeacherCommandUseCase teacherCommandUseCase) {
        this.teacherCommandUseCase = teacherCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddTeacherCommand addTeacherCommand){
        return teacherCommandUseCase.add(addTeacherCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateTeacherCommand updateTeacherCommand){
        return teacherCommandUseCase.update(id, updateTeacherCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return teacherCommandUseCase.delete(id);
    }
}