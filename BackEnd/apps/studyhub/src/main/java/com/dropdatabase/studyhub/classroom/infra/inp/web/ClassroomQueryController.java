package com.dropdatabase.studyhub.classroom.infra.inp.web;

import com.dropdatabase.studyhub.classroom.application.ClassroomQueryUseCase;
import com.dropdatabase.studyhub.classroom.domain.Classroom;
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
    public List<Classroom> getAll(){
        return classroomQueryUseCase.getAll();
    }
}