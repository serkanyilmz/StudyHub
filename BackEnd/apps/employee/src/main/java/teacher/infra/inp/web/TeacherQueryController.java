package teacher.infra.inp.web;

import teacher.application.TeacherQueryUseCase;
import teacher.domain.Teacher;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
public class TeacherQueryController {

    private final TeacherQueryUseCase teacherQueryUseCase;

    public TeacherQueryController(TeacherQueryUseCase teacherQueryUseCase) {
        this.teacherQueryUseCase = teacherQueryUseCase;
    }

    @GetMapping
    public List<Teacher> getAll(){
        return teacherQueryUseCase.getAll();
    }
}