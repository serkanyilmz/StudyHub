package com.dropdatabase.studyhub.student.classroom.infra.inp.web;

import com.dropdatabase.studyhub.student.classroom.application.ClassroomQueryUseCase;
import com.dropdatabase.studyhub.student.classroom.domain.Classroom;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/classroom")
public class ClassroomQueryController {

    private final ClassroomQueryUseCase classroomQueryUseCase;

    public ClassroomQueryController(ClassroomQueryUseCase classroomQueryUseCase) {
        this.classroomQueryUseCase = classroomQueryUseCase;
    }

    @GetMapping("/{id}")
    public Classroom get(@PathVariable UUID id){
        return classroomQueryUseCase.get(id);
    }

    @GetMapping
    public List<Classroom> getAll(@RequestParam UUID studentId){
        return classroomQueryUseCase.getAll(studentId);
    }
}