package com.dropdatabase.studyhub.teacher.infra.out.jpa;// src/main/java/com.dropdatabase.studyhub.employee.teacher/infra/out/persistence/TeacherJpaAdapter.java

import com.dropdatabase.studyhub.answer.infra.out.jpa.AnswerJpaRepository;
import com.dropdatabase.studyhub.answer.infra.out.jpa.entity.AnswerJpaEntity;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.ClassroomJpaRepository;
import com.dropdatabase.studyhub.classroom.infra.out.jpa.entity.ClassroomJpaEntity;
import com.dropdatabase.studyhub.homework.infra.out.jpa.HomeworkJpaRepository;
import com.dropdatabase.studyhub.homework.infra.out.jpa.entity.HomeworkJpaEntity;
import com.dropdatabase.studyhub.student.infra.out.jpa.entity.StudentJpaEntity;
import com.dropdatabase.studyhub.teacher.application.command.AddTeacherCommand;
import com.dropdatabase.studyhub.teacher.application.port.TeacherQueryPort;
import com.dropdatabase.studyhub.teacher.domain.Teacher;
import com.dropdatabase.studyhub.teacher.infra.out.jpa.entity.TeacherJpaEntity;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class TeacherQueryJpaAdapter implements TeacherQueryPort {

    private final TeacherJpaRepository teacherJpaRepository;
    private final ClassroomJpaRepository classroomJpaRepository;
    private final HomeworkJpaRepository homeworkJpaRepository;
    private final AnswerJpaRepository answerJpaRepository;

    public TeacherQueryJpaAdapter(TeacherJpaRepository teacherJpaRepository, 
                                 ClassroomJpaRepository classroomJpaRepository,
                                 HomeworkJpaRepository homeworkJpaRepository,
                                 AnswerJpaRepository answerJpaRepository) {
        this.teacherJpaRepository = teacherJpaRepository;
        this.classroomJpaRepository = classroomJpaRepository;
        this.homeworkJpaRepository = homeworkJpaRepository;
        this.answerJpaRepository = answerJpaRepository;
    }

    @Override
    public Teacher get(UUID id) {
        Optional<TeacherJpaEntity> teacherJpaEntityOptional = teacherJpaRepository.findById(id.toString());
        return teacherJpaEntityOptional.get().toDomainEntity();
    }

    @Override
    public List<Teacher> getAll() {
        List<TeacherJpaEntity> teachersJpaList = teacherJpaRepository.findAll();
        List<Teacher> teachers = teachersJpaList.stream()
                .map(TeacherJpaEntity::toDomainEntity)
                .collect(Collectors.toList());
        return teachers;
    }

    @Override
    public int getUniqueStudentsCount(UUID teacherId) {
        // Get all classrooms for this teacher
        List<ClassroomJpaEntity> teacherClassrooms = classroomJpaRepository.findAll().stream()
                .filter(classroom -> classroom.getTeacher().getId().equals(teacherId.toString()))
                .collect(Collectors.toList());

        // Use a Set to store unique student IDs
        Set<String> uniqueStudentIds = new HashSet<>();

        // Iterate through all classrooms and add students to the set
        for (ClassroomJpaEntity classroom : teacherClassrooms) {
            for (StudentJpaEntity student : classroom.getStudents()) {
                uniqueStudentIds.add(student.getId());
            }
        }

        return uniqueStudentIds.size();
    }

    @Override
    public AddTeacherCommand.ClassroomStatsCommand getClassroomStats(UUID teacherId, UUID classroomId) {
        // Get the classroom
        Optional<ClassroomJpaEntity> classroomOpt = classroomJpaRepository.findById(classroomId.toString());
        if (classroomOpt.isEmpty()) {
            return new AddTeacherCommand.ClassroomStatsCommand(0.0, 0.0, 0, 0, 0);
        }

        ClassroomJpaEntity classroom = classroomOpt.get();
        
        // Verify teacher owns this classroom
        if (!classroom.getTeacher().getId().equals(teacherId.toString())) {
            return new AddTeacherCommand.ClassroomStatsCommand(0.0, 0.0, 0, 0, 0);
        }

        List<StudentJpaEntity> students = classroom.getStudents();
        int totalStudents = students.size();

        if (totalStudents == 0) {
            return new AddTeacherCommand.ClassroomStatsCommand(0.0, 0.0, 0, 0, 0);
        }

        // Get homework for this classroom
        List<HomeworkJpaEntity> homeworkList = homeworkJpaRepository.findAll().stream()
                .filter(hw -> hw.getClassroom().getId().equals(classroomId.toString()))
                .collect(Collectors.toList());

        int totalQuizzes = 0;
        int completedQuizzes = 0;
        double totalScore = 0.0;
        int scoredAnswers = 0;

        // Calculate total quizzes across all homework
        for (HomeworkJpaEntity homework : homeworkList) {
            totalQuizzes += homework.getQuizzes().size();
        }

        // Get all answers for students in this classroom
        List<AnswerJpaEntity> allAnswers = answerJpaRepository.findAll();

        // Filter answers for students in this classroom and calculate scores properly
        for (StudentJpaEntity student : students) {
            List<AnswerJpaEntity> studentAnswers = allAnswers.stream()
                    .filter(answer -> answer.getStudent().getId().equals(student.getId()))
                    .collect(Collectors.toList());

            // Group answers by quiz to calculate quiz scores
            Set<String> completedQuizIds = new HashSet<>();
            
            // Group answers by quiz
            var answersByQuiz = studentAnswers.stream()
                    .filter(answer -> {
                        String quizId = answer.getQuiz().getId();
                        return homeworkList.stream()
                                .anyMatch(hw -> hw.getQuizzes().stream()
                                        .anyMatch(quiz -> quiz.getId().equals(quizId)));
                    })
                    .collect(Collectors.groupingBy(answer -> answer.getQuiz().getId()));
            
            // Calculate score for each completed quiz
            for (var entry : answersByQuiz.entrySet()) {
                String quizId = entry.getKey();
                List<AnswerJpaEntity> quizAnswers = entry.getValue();
                
                completedQuizIds.add(quizId);
                
                // Calculate score for this quiz
                long correctAnswers = quizAnswers.stream()
                        .mapToLong(answer -> answer.getOption().isCorrect() ? 1 : 0)
                        .sum();
                
                double quizScore = quizAnswers.size() > 0 ? 
                        (double) correctAnswers / quizAnswers.size() * 100.0 : 0.0;
                
                totalScore += quizScore;
                scoredAnswers++;
            }
            
            completedQuizzes += completedQuizIds.size();
        }

        // Calculate averages
        double averageScore = scoredAnswers > 0 ? totalScore / scoredAnswers : 0.0;
        double completionRate = (totalStudents * totalQuizzes) > 0 ? 
                (double) completedQuizzes / (totalStudents * totalQuizzes) * 100.0 : 0.0;

        return new AddTeacherCommand.ClassroomStatsCommand(averageScore, completionRate, totalStudents, totalQuizzes, completedQuizzes);
    }
}