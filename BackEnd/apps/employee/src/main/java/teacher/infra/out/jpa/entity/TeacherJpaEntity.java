package teacher.infra.out.jpa.entity;

import teacher.domain.Teacher;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "teacher")
public class TeacherJpaEntity {
    @Id
        private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber; // Yeni ekledik
    private LocalDateTime registrationDate; // Yeni ekledik

    public TeacherJpaEntity() {
    }

    public TeacherJpaEntity(UUID id, String firstName, String lastName, String email, String phoneNumber, LocalDateTime registrationDate) {
        this.id = id.toString();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.registrationDate = registrationDate;
    }

    public TeacherJpaEntity(Teacher teacher) {
        this.id = teacher.getId().toString();
        this.firstName = teacher.getFirstName();
        this.lastName = teacher.getLastName();
        this.email = teacher.getEmail();
        this.phoneNumber = teacher.getPhoneNumber();
        this.registrationDate = LocalDateTime.now();
    }

    public Teacher toDomainEntity() {
        return new Teacher(
                UUID.fromString(id),
                this.firstName,
                this.lastName,
                this.email,
                this.phoneNumber,
                this.registrationDate
        );
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TeacherJpaEntity teacher = (TeacherJpaEntity) o;
        return Objects.equals(id, teacher.id) && Objects.equals(email, teacher.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
}