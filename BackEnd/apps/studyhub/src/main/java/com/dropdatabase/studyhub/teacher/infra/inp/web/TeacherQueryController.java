package com.dropdatabase.studyhub.teacher.infra.inp.web;

import com.dropdatabase.studyhub.teacher.application.TeacherQueryUseCase;
import com.dropdatabase.studyhub.teacher.application.command.AddTeacherCommand;
import com.dropdatabase.studyhub.teacher.domain.Teacher;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/teacher")
public class TeacherQueryController {

    private final TeacherQueryUseCase teacherQueryUseCase;

    public TeacherQueryController(TeacherQueryUseCase teacherQueryUseCase) {
        this.teacherQueryUseCase = teacherQueryUseCase;
    }

    @GetMapping("/{id}")
    public Teacher get(@PathVariable UUID id){
        return teacherQueryUseCase.get(id);
    }

    @GetMapping
    public List<Teacher> getAll(){
        return teacherQueryUseCase.getAll();
    }

    @GetMapping("/{id}/unique-students-count")
    public int getUniqueStudentsCount(@PathVariable UUID id){
        return teacherQueryUseCase.getUniqueStudentsCount(id);
    }

    @GetMapping("/{id}/classroom/{classroomId}/stats")
    public AddTeacherCommand.ClassroomStatsCommand getClassroomStats(@PathVariable UUID id, @PathVariable UUID classroomId){
        return teacherQueryUseCase.getClassroomStats(id, classroomId);
    }
}