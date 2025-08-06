package com.dropdatabase.studyhub.student.infra.inp.web;

import com.dropdatabase.studyhub.student.application.StudentQueryUseCase;
import com.dropdatabase.studyhub.student.domain.Student;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/student")
public class StudentQueryController {

    private final StudentQueryUseCase studentQueryUseCase;

    public StudentQueryController(StudentQueryUseCase studentQueryUseCase) {
        this.studentQueryUseCase = studentQueryUseCase;
    }

    @GetMapping("/{id}")
    public Student get(@PathVariable UUID id){
        return studentQueryUseCase.get(id);
    }

    @GetMapping
    public List<Student> getAll(){
        return studentQueryUseCase.getAll();
    }

    @GetMapping("/classroom/{classroomId}")
    public List<Student> getAllByClassroomId(@PathVariable UUID classroomId){
        return studentQueryUseCase.getAllByClassroomId(classroomId);
    }
}