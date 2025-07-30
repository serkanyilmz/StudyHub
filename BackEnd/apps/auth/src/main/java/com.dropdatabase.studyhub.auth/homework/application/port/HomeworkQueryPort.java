package com.dropdatabase.studyhub.auth.homework.application.port;

import com.dropdatabase.studyhub.auth.homework.domain.Homework;

import java.util.List;
import java.util.UUID;

public interface HomeworkQueryPort {
    Homework get(UUID id);
    List<Homework> getAll();
}