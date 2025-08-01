package com.dropdatabase.studyhub.question.infra.ai;// src/main/java/com.dropdatabase.studyhub.employee.option/infra/out/persistence/OptionJpaAdapter.java

import com.dropdatabase.studyhub.question.application.port.OptionCommandPort;
import com.dropdatabase.studyhub.question.application.port.QuestionAIPort;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.question.infra.out.jpa.OptionJpaRepository;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.OptionJpaEntity;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Component;

import com.google.genai.Client;


@Component
public class QuestionAIGeminiAdapter implements QuestionAIPort {

    private final Client client;

    public QuestionAIGeminiAdapter(Client client) {
        this.client = client;
    }

    @Override
    public String getAnswerExplanation(Question question) {
        if (question == null) {
            return "No question provided for explanation.";
        }

        Option correctAnswer = question.getOptions().stream()
                .filter(Option::isCorrect)
                .findFirst()
                .orElse(null);

        String promptText = buildExplanationPrompt(question, correctAnswer);
        GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash",
                promptText, null);

        return response.text();
    }

    private String buildExplanationPrompt(Question question, Option correctAnswer) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are an expert educator. Provide a concise and clear explanation for the following multiple-choice question.\n\n");
        promptBuilder.append("Question: ").append(question.getText()).append("\n\n");
        promptBuilder.append("Options:\n");
        for (Option option : question.getOptions()) {
            promptBuilder.append("- ").append(option.getText()).append("\n");
        }
        promptBuilder.append("\nCorrect Answer: ").append(correctAnswer.getText()).append("\n\n");
        promptBuilder.append("Please explain why the correct answer is correct. Briefly mention why the other options are incorrect if it enhances the explanation. Keep the explanation under 150 words and focus on clarity and accuracy.");

        return promptBuilder.toString();
    }
}