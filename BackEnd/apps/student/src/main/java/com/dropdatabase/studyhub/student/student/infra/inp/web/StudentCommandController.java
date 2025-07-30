package com.dropdatabase.studyhub.student.student.infra.inp.web;

import com.dropdatabase.studyhub.student.common.MessageResponse;
import com.dropdatabase.studyhub.student.student.application.StudentCommandUseCase;
import com.dropdatabase.studyhub.student.student.application.command.AddStudentCommand;
import com.dropdatabase.studyhub.student.student.application.command.UpdateStudentCommand;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/student")
public class StudentCommandController {

    private final StudentCommandUseCase studentCommandUseCase;

    public StudentCommandController(StudentCommandUseCase studentCommandUseCase) {
        this.studentCommandUseCase = studentCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddStudentCommand addStudentCommand){
        return studentCommandUseCase.add(addStudentCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateStudentCommand updateStudentCommand){
        return studentCommandUseCase.update(id, updateStudentCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return studentCommandUseCase.delete(id);
    }

}