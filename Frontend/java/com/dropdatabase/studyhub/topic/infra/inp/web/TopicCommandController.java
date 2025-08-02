package com.dropdatabase.studyhub.topic.infra.inp.web;

import com.dropdatabase.studyhub.common.MessageResponse;
import com.dropdatabase.studyhub.topic.application.TopicCommandUseCase;
import com.dropdatabase.studyhub.topic.application.command.UpdateTopicCommand;
import org.springframework.web.bind.annotation.*;
import com.dropdatabase.studyhub.topic.application.command.AddTopicCommand;

import java.util.UUID;

@RestController
@RequestMapping("/topic")
public class TopicCommandController {

    private final TopicCommandUseCase topicCommandUseCase;

    public TopicCommandController(TopicCommandUseCase topicCommandUseCase) {
        this.topicCommandUseCase = topicCommandUseCase;
    }

    @PostMapping
    public MessageResponse add(@RequestBody AddTopicCommand addTopicCommand){
        return topicCommandUseCase.add(addTopicCommand);
    }

    @PutMapping("/{id}")
    public MessageResponse update(@PathVariable UUID id, @RequestBody UpdateTopicCommand updateTopicCommand){
        return topicCommandUseCase.update(id, updateTopicCommand);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable UUID id){
        return topicCommandUseCase.delete(id);
    }
}
