package com.dropdatabase.studyhub.teacher.application.command;


import com.dropdatabase.studyhub.teacher.domain.Teacher;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

public record AddTeacherCommand(String firstName, String lastName, String email, String phoneNumber) {
    public Teacher toDomainEntity(){
        return new Teacher(firstName, lastName, email, phoneNumber);
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClassroomStatsCommand {
        private double averageScore;
        private double completionRate;
        private int totalStudents;
        private int totalQuizzes;
        private int completedQuizzes;
    }
}