package com.dropdatabase.studyhub.student.topic.infra.inp.web;

import com.dropdatabase.studyhub.student.topic.application.TopicQueryUseCase;
import com.dropdatabase.studyhub.student.topic.domain.Topic;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/topic")
public class TopicQueryController {

    private final TopicQueryUseCase topicQueryUseCase;

    public TopicQueryController(TopicQueryUseCase topicQueryUseCase) {
        this.topicQueryUseCase = topicQueryUseCase;
    }

    @GetMapping("/{id}")
    public Topic get(@PathVariable UUID id){
        return topicQueryUseCase.get(id);
    }

    @GetMapping
    public List<Topic> getAll(){
        return topicQueryUseCase.getAll();
    }
}