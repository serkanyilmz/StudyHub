package com.dropdatabase.studyhub.student.common;

import lombok.Getter;

@Getter
public class MessageResponse {
    private String message;
    private MessageType messageType;

    public MessageResponse(String message, MessageType messageType) {
        this.message = message;
        this.messageType = messageType;
    }

    public boolean hasError() {
        return messageType == MessageType.ERROR;
    }
}