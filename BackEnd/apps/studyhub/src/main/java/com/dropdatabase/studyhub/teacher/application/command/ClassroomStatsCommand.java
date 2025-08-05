package com.dropdatabase.studyhub.teacher.application.command;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ClassroomStatsCommand {
    private double averageScore;
    private double completionRate;
    private int totalStudents;
    private int totalQuizzes;
    private int completedQuizzes;
}
