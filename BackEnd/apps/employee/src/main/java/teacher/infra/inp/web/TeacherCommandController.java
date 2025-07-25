package teacher.infra.inp.web;

import teacher.application.TeacherCommandUseCase;
import teacher.application.command.UpdateTeacherCommand;
import org.springframework.web.bind.annotation.*;
import teacher.application.command.AddTeacherCommand;

import java.util.UUID;

@RestController
@RequestMapping("/teacher")
public class TeacherCommandController {

    private final TeacherCommandUseCase teacherCommandUseCase;

    public TeacherCommandController(TeacherCommandUseCase teacherCommandUseCase) {
        this.teacherCommandUseCase = teacherCommandUseCase;
    }

    @PostMapping
    public String add(@RequestBody AddTeacherCommand addTeacherCommand){
        return teacherCommandUseCase.add(addTeacherCommand);
    }

    @PutMapping("/{id}")
    public String update(@PathVariable UUID id, @RequestBody UpdateTeacherCommand updateTeacherCommand){
        return teacherCommandUseCase.update(id, updateTeacherCommand);
    }
}