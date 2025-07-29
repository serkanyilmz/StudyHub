CREATE TABLE IF NOT EXISTS teacher (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(255),
    registration_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS writer (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(255),
    registration_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS classroom (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_classroom_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES teacher (id)
    ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS topic (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_topic_id VARCHAR(255),
    CONSTRAINT fk_topic_parent
    FOREIGN KEY (parent_topic_id)
    REFERENCES topic (id)
    ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS question (
    id VARCHAR(255) PRIMARY KEY,
    text TEXT NOT NULL,
    topic_id VARCHAR(255),
    writer_id VARCHAR(255),
    CONSTRAINT fk_question_topic
    FOREIGN KEY (topic_id)
    REFERENCES topic (id)
    ON DELETE CASCADE,
    CONSTRAINT fk_question_writer
    FOREIGN KEY (writer_id)
    REFERENCES writer (id)
    ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS option (
    id VARCHAR(255) PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_option_question
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS quiz_question (
   quiz_id VARCHAR(255) NOT NULL,
   name VARCHAR(255) NOT NULL,
   question_id VARCHAR(255) NOT NULL,
   question_no INT NOT NULL,
   PRIMARY KEY (quiz_id, question_id),
   FOREIGN KEY (quiz_id) REFERENCES quiz(id),
   FOREIGN KEY (question_id) REFERENCES question(id)
);


CREATE TABLE IF NOT EXISTS homework (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    classroom_id VARCHAR(255) NOT NULL,
    deadline VARCHAR(255) NOT NULL,
    CONSTRAINT fk_classroom
    FOREIGN KEY (classroom_id)
    REFERENCES classroom (id)
    );

CREATE TABLE IF NOT EXISTS homework_quiz (
    homework_id VARCHAR(255) NOT NULL,
    quiz_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (quiz_id, homework_id),
    FOREIGN KEY (quiz_id) REFERENCES quiz(id),
    FOREIGN KEY (homework_id) REFERENCES homework(id)
    );
