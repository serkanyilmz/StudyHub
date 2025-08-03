package com.dropdatabase.studyhub.question.infra.ai;// src/main/java/com.dropdatabase.studyhub.employee.option/infra/out/persistence/OptionJpaAdapter.java

import com.dropdatabase.studyhub.question.application.port.OptionCommandPort;
import com.dropdatabase.studyhub.question.application.port.QuestionAIPort;
import com.dropdatabase.studyhub.question.domain.Option;
import com.dropdatabase.studyhub.question.domain.Question;
import com.dropdatabase.studyhub.question.infra.out.jpa.OptionJpaRepository;
import com.dropdatabase.studyhub.question.infra.out.jpa.entity.OptionJpaEntity;
import com.dropdatabase.studyhub.topic.domain.Topic;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Component;

import com.google.genai.Client;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


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

    @Override
    public Question getSampleQuestion(Topic topic) {
        if (topic == null) {
            return null; // Or throw an IllegalArgumentException
        }

        String promptText = buildSampleQuestionPrompt(topic);
        GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash",
                promptText, null);

        String generatedContent = response.text();
        return parseGeneratedQuestion(generatedContent);
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

    private String buildSampleQuestionPrompt(Topic topic) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are an expert educator. Generate a multiple-choice question about the following topic:\n\n");
        promptBuilder.append("Topic: ").append(topic.getName()).append("\n\n");
        if (topic.getParentTopic() != null) {
            promptBuilder.append("Related to the broader topic of: ").append(topic.getParentTopic().getName()).append("\n\n");
        }
        promptBuilder.append("The question should have 4 options, with only one correct answer. Please format the output as follows:\n");
        promptBuilder.append("Question: [Your question text here]\n");
        promptBuilder.append("A) [Option A text]\n");
        promptBuilder.append("B) [Option B text]\n");
        promptBuilder.append("C) [Option C text]\n");
        promptBuilder.append("D) [Option D text]\n");
        promptBuilder.append("Correct Answer: [Letter of the correct option, e.g., A, B, C, or D]\n");
        promptBuilder.append("Ensure the question and options are clear and concise.");

        return promptBuilder.toString();
    }

    private Question parseGeneratedQuestion(String generatedContent) {
        String questionText = extractPattern(generatedContent, "Question: (.*)");
        String optionAText = extractPattern(generatedContent, "A\\) (.*)");
        String optionBText = extractPattern(generatedContent, "B\\) (.*)");
        String optionCText = extractPattern(generatedContent, "C\\) (.*)");
        String optionDText = extractPattern(generatedContent, "D\\) (.*)");
        String correctAnswerLetter = extractPattern(generatedContent, "Correct Answer: ([A-D])");

        if (questionText == null || optionAText == null || optionBText == null || optionCText == null || optionDText == null || correctAnswerLetter == null) {
            // Log an error or return a default/empty question if parsing fails
            return null;
        }

        List<Option> options = new ArrayList<>();
        options.add(new Option(optionAText, "A".equals(correctAnswerLetter)));
        options.add(new Option(optionBText, "B".equals(correctAnswerLetter)));
        options.add(new Option(optionCText, "C".equals(correctAnswerLetter)));
        options.add(new Option(optionDText, "D".equals(correctAnswerLetter)));

        Question question = new Question(questionText, null, null);
        question.setOptions(options);

        return question;
    }

    private String extractPattern(String text, String regex) {
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }
}