package com.dropdatabase.studyhub.question.application.port;

import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;

import java.util.UUID;

public interface OptionCommandPort {
    Option get(UUID id);
}
