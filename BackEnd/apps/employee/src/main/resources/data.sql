DELETE FROM option;
DELETE FROM question;
DELETE FROM classroom;
DELETE FROM topic;
DELETE FROM teacher;
DELETE FROM writer;

--Teacher
INSERT INTO teacher (id, first_name, last_name, email, phone_number, registration_date) VALUES
    ('teacher_1_uuid', 'Erkim Berk', 'Unsal', 'elif.demir@studyhub.com', '5301234567', CURRENT_TIMESTAMP),
    ('teacher_2_uuid', 'Burak', 'Can', 'burak.can@studyhub.com', '5329876543', CURRENT_TIMESTAMP),
    ('teacher_3_uuid', 'Zeynep', 'Kaya', 'zeynep.kaya@studyhub.com', '5351122334', CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO NOTHING;

--Writer
INSERT INTO writer (id, first_name, last_name, email, phone_number, registration_date) VALUES
    ('writer_1_uuid', 'Cem', 'Aksoy', 'cem.aksoy@studyhub.com', '5401112233', CURRENT_TIMESTAMP),
    ('writer_2_uuid', 'Deniz', 'Çelik', 'deniz.celik@studyhub.com', '5429988776', CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO NOTHING;

--Topic
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('topic_math_uuid', 'Mathematics', NULL),
    ('topic_science_uuid', 'Science', NULL),
    ('topic_history_uuid', 'History', NULL)
    ON CONFLICT (id) DO NOTHING;
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('topic_algebra_uuid', 'Algebra', 'topic_math_uuid'),
    ('topic_geometry_uuid', 'Geometry', 'topic_math_uuid')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO topic (id, name, parent_topic_id) VALUES
   ('topic_physics_uuid', 'Physics', 'topic_science_uuid'),
   ('topic_chemistry_uuid', 'Chemistry', 'topic_science_uuid'),
   ('topic_biology_uuid', 'Biology', 'topic_science_uuid')
    ON CONFLICT (id) DO NOTHING;
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('topic_linear_algebra_uuid', 'Linear Algebra', 'topic_algebra_uuid')
    ON CONFLICT (id) DO NOTHING;

--Question
INSERT INTO question (id, text) VALUES
    ('q_math_1_uuid', 'What is the sum of angles in a triangle?'),
    ('q_math_2_uuid', 'Solve for x: 2x + 5 = 15'),
    ('q_physics_1_uuid', 'What is the SI unit of force?'),
    ('q_chemistry_1_uuid', 'What is the chemical symbol for water?'),
    ('q_history_1_uuid', 'Who was the first Roman emperor?')
    ON CONFLICT (id) DO NOTHING;

--Option
INSERT INTO option (id, text, is_correct, question_id) VALUES
    ('o_math_1_a_uuid', '90 degrees', FALSE, 'q_math_1_uuid'),
    ('o_math_1_b_uuid', '180 degrees', TRUE, 'q_math_1_uuid'),
    ('o_math_1_c_uuid', '270 degrees', FALSE, 'q_math_1_uuid'),
    ('o_math_1_d_uuid', '360 degrees', FALSE, 'q_math_1_uuid')
    ON CONFLICT (id) DO NOTHING;

-- 'q_math_2_uuid' için seçenekler (x için çöz: 2x + 5 = 15)
INSERT INTO option (id, text, is_correct, question_id) VALUES
    ('o_math_2_a_uuid', '5', TRUE, 'q_math_2_uuid'),
    ('o_math_2_b_uuid', '10', FALSE, 'q_math_2_uuid'),
    ('o_math_2_c_uuid', '2', FALSE, 'q_math_2_uuid'),
    ('o_math_2_d_uuid', '7.5', FALSE, 'q_math_2_uuid')
    ON CONFLICT (id) DO NOTHING;

-- 'q_physics_1_uuid' için seçenekler (Kuvvetin SI birimi nedir?)
INSERT INTO option (id, text, is_correct, question_id) VALUES
    ('o_phy_1_a_uuid', 'Joule', FALSE, 'q_physics_1_uuid'),
    ('o_phy_1_b_uuid', 'Watt', FALSE, 'q_physics_1_uuid'),
    ('o_phy_1_c_uuid', 'Newton', TRUE, 'q_physics_1_uuid'),
    ('o_phy_1_d_uuid', 'Volt', FALSE, 'q_physics_1_uuid')
    ON CONFLICT (id) DO NOTHING;

-- 'q_chemistry_1_uuid' için seçenekler (Suyun kimyasal sembolü nedir?)
INSERT INTO option (id, text, is_correct, question_id) VALUES
    ('o_chm_1_a_uuid', 'O2', FALSE, 'q_chemistry_1_uuid'),
    ('o_chm_1_b_uuid', 'H2O', TRUE, 'q_chemistry_1_uuid'),
    ('o_chm_1_c_uuid', 'CO2', FALSE, 'q_chemistry_1_uuid'),
    ('o_chm_1_d_uuid', 'NaCl', FALSE, 'q_chemistry_1_uuid')
    ON CONFLICT (id) DO NOTHING;

-- 'q_history_1_uuid' için seçenekler (İlk Roma imparatoru kimdi?)
INSERT INTO option (id, text, is_correct, question_id) VALUES
    ('o_his_1_a_uuid', 'Julius Caesar', FALSE, 'q_history_1_uuid'),
    ('o_his_1_b_uuid', 'Augustus', TRUE, 'q_history_1_uuid'),
    ('o_his_1_c_uuid', 'Nero', FALSE, 'q_history_1_uuid'),
    ('o_his_1_d_uuid', 'Caligula', FALSE, 'q_history_1_uuid')
    ON CONFLICT (id) DO NOTHING;

--Classroom
INSERT INTO classroom (id, code, name, teacher_id) VALUES
    ('class_math_101_uuid', 'MATH101', 'Intro to Algebra', 'teacher_1_uuid'),
    ('class_sci_101_uuid', 'SCI101', 'General Science', 'teacher_2_uuid')
    ON CONFLICT (id) DO NOTHING;