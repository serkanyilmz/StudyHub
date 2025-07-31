package com.dropdatabase.studyhub.classroom.domain;

import com.dropdatabase.studyhub.teacher.domain.Teacher;
import lombok.Getter;

import java.util.UUID;

@Getter
public class Classroom {
    private UUID id;
    private String code;
    private String name;
    private Teacher teacher;

    public Classroom(String code, String name, Teacher teacher) {
        this.id = UUID.randomUUID();
        this.code = code;
        this.name = name;
        this.teacher = teacher;
    }

    public Classroom(UUID id, String code, String name, Teacher teacher) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.teacher = teacher;
    }
}