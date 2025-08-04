package com.dropdatabase.studyhub.answer.infra.ai;

import com.dropdatabase.studyhub.answer.application.port.AnswerAIPort;
import com.dropdatabase.studyhub.answer.domain.Answer;
import com.dropdatabase.studyhub.question.domain.Option;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class AnswerAIGeminiAdapter implements AnswerAIPort {
    private final Client client;

    public AnswerAIGeminiAdapter(Client client) {
        this.client = client;
    }
    @Override
    public List<String> getStudentProgress(List<Answer> answers) {
        String promptText = buildProgressPrompt(answers);
        GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash",
                promptText, null);

        String responseText = response.text();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(responseText, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            // fallback in case AI returns something malformed
            return List.of("Unknown", "Try again");
        }
    }

    private String buildProgressPrompt(List<Answer> answers) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert educational AI. Analyze the student's answers below and respond with exactly two values in a JSON array: ")
                .append("[\"<performance>\", \"<advice>\"]\n")
                .append("Performance must be one of: Good, Average, or Bad.\n")
                .append("Advice must be a **short and actionable** message (maximum 5 words), such as:\n")
                .append(" - 'Review fractions'\n")
                .append(" - 'Practice grammar rules again'\n")
                .append(" - 'Focus on reading speed'\n")
                .append(" - 'Improve geometry skills'\n")
                .append("Base your decision on correctness, question types, recurring mistakes, and content patterns.\n")
                .append("Do not explain your reasoning. Return only the array.\n\n");

        for (Answer answer : answers) {
            prompt.append("Question: ").append(answer.getQuestion().getText()).append("\n");
            prompt.append("Options: ");
            for (Option option : answer.getQuestion().getOptions()) {
                prompt.append(option.getText()).append(option.isCorrect() ? " (Correct)" : "").append("; ");
            }
            prompt.append("\nStudent Answer: ").append(answer.getOption().getText());
            prompt.append(answer.getOption().isCorrect() ? " (Correct)\n" : " (Incorrect)\n");
        }

        return prompt.toString();
    }

}
