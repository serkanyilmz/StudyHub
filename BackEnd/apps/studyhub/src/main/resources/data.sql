DELETE FROM classroom_student;
DELETE FROM answer;
DELETE FROM student;
DELETE FROM homework_quiz;
DELETE FROM homework;
DELETE FROM option;
DELETE FROM quiz_question;
DELETE FROM quiz;
DELETE FROM question;
DELETE FROM classroom_student;
DELETE FROM classroom;
DELETE FROM topic;
DELETE FROM teacher;
DELETE FROM writer;
DELETE FROM users;

--Users
INSERT INTO users (id, username, password, full_name, role, created_at, updated_at, approved) VALUES
      ('37318be1-2d85-491d-8a19-8618b9256045', 'serkan.yilmaz', 'hashed-password-1', 'Serkan Yilmaz', 'STUDENT', CURRENT_TIMESTAMP, NULL, true),
      ('11111111-2222-3333-4444-555555555555', 'deniz.celik', 'hashed-password-2', 'Deniz Çelik', 'TEACHER', CURRENT_TIMESTAMP, NULL, true),
      ('02ce1001-197a-420a-b88d-7f60c0646020', 'sumeyye.sakar', '$2a$10$5ybVE4tJhjyi3oE0JWCd8OI/Si17u67t.eU2RyHgo9O32eu5xOONW', 'Asli Mansur', 'STUDENT', CURRENT_TIMESTAMP, NULL, true)
    ON CONFLICT (id) DO NOTHING;

--Teacher
INSERT INTO teacher (id, first_name, last_name, email, phone_number, registration_date) VALUES
    ('6ac7e45f-6860-454a-a349-a031a7abb979', 'Erkim Berk', 'Unsal', 'elif.demir@studyhub.com', '5301234567', CURRENT_TIMESTAMP),
    ('f3087d3e-d436-489e-ba96-fc8b36e71582', 'Burak', 'Can', 'burak.can@studyhub.com', '5329876543', CURRENT_TIMESTAMP),
    ('253493d6-0cf0-4b3b-a2db-e189abee4e6d', 'Zeynep', 'Kaya', 'zeynep.kaya@studyhub.com', '5351122334', CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO NOTHING;

--Classroom
INSERT INTO classroom (id, code, name, teacher_id) VALUES
    ('6afc06b9-8b54-4ae8-ad61-21afb5541b6c', 'ALGEB101', 'Introduction to Algebra', '6ac7e45f-6860-454a-a349-a031a7abb979'),
    ('4af50907-aad0-443d-926a-335acc58ef93', 'INTEG101', 'Introduction to Integral', '6ac7e45f-6860-454a-a349-a031a7abb979'),
    ('b6d74e9e-1f21-4f73-a500-da0cd1d9b242', 'LOG101', 'Introduction to Logarithms', '6ac7e45f-6860-454a-a349-a031a7abb979'),
    ('753de14c-3fad-4f6c-96d0-2b8512ce2be6', 'SCI101', 'General Science', 'f3087d3e-d436-489e-ba96-fc8b36e71582')
    ON CONFLICT (id) DO NOTHING;

--Writer
INSERT INTO writer (id, first_name, last_name, email, phone_number, registration_date) VALUES
    ('37318be1-2d85-491d-8a19-8618b9256045', 'Serkan', 'Yilmaz', 'serkan.yilmaz@studyhub.com', '5401112233', CURRENT_TIMESTAMP),
    ('11111111-2222-3333-4444-555555555555', 'Deniz', 'Çelik', 'deniz.celik@studyhub.com', '5429988776', CURRENT_TIMESTAMP),
    ('5adee6b9-da8d-4039-8f5c-11c0d3255c09', 'Asli', 'Mansur', 'asli.mansur@studyhub.com', '5429985556', CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO NOTHING;
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Algebra', NULL),
    ('529314fc-a65c-44a9-ada7-f5cc12c8a664', 'History of the Turkish Revolution', NULL)
    ON CONFLICT (id) DO NOTHING;

--- ALGEBRA TOPICS
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('0e9f8e7d-6c5b-4a32-10fe-dcba98765432', 'Introduction to Algebra', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
    ('1f2e3d4c-5b6a-7f8e-9d0c-1b2a3f4e5d6c', 'Equations', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
    ('2a3b4c5d-6e7f-8a9b-c0d1-e2f3a4b5c6d7', 'Inequalities', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
    ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Polynomials', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
    ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'Exponents and Radicals', 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'Variables and Constants', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432'),
    ('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'Algebraic Expressions', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432'),
    ('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'Terms and Coefficients', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432'),
    ('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'Simplifying Algebraic Expressions', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432'),

    ('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 'Linear Equations in One Variable', '1f2e3d4c-5b6a-7f8e-9d0c-1b2a3f4e5d6c'),
    ('a0b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d', 'Linear Equations in Two Variables', '1f2e3d4c-5b6a-7f8e-9d0c-1b2a3f4e5d6c'),
    ('b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e', 'Quadratic Equations', '1f2e3d4c-5b6a-7f8e-9d0c-1b2a3f4e5d6c'),

    ('c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f', 'Linear Inequalities in One Variable', '2a3b4c5d-6e7f-8a9b-c0d1-e2f3a4b5c6d7'),
    ('d3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a', 'Absolute Value Inequalities', '2a3b4c5d-6e7f-8a9b-c0d1-e2f3a4b5c6d7'),
    ('e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', 'Systems of Inequalities', '2a3b4c5d-6e7f-8a9b-c0d1-e2f3a4b5c6d7'),

    ('f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c', 'Introduction to Polynomials and Basic Operations', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'),
    ('a6b7c8d9-e0f1-2a3b-4c5d-6e7f8a9b0c1d', 'Polynomial Division', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'),
    ('b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e', 'Factoring Techniques', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f'),

    ('c8d9e0f1-a2b3-4c5d-6e7f-8a9b0c1d2e3f', 'Exponents and Their Properties', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'),
    ('d9e0f1a2-b3c4-5d6e-7f8a-9b0c1d2e3f4a', 'Radicals and Their Properties', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a'),
    ('e0f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', 'Rational Exponents', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 'Basic Solving Methods', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f'),
    ('a2b3c4d5-e6f7-8a9b-c0d1-e2f3a4b5c6d7', 'Equations with Parentheses', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f'),
    ('b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e', 'Fractional Equations', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f'),
    ('c4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Word Problems', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f'),

    ('d5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'Systems of Equations', 'a0b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d'),
    ('e6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'Linear Functions and Their Graphs', 'a0b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d'),

    ('f7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 'Factoring', 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e'),
    ('a8b9c0d1-e2f3-a4b5-c6d7-e8f9a0b1c2d3', 'Completing the Square', 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e'),
    ('b9c0d1e2-f3a4-b5c6-d7e8-f9a0b1c2d3e4', 'Discriminant', 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e'),
    ('c0d1e2f3-a4b5-c6d7-e8f9-a0b1c2d3e4f5', 'Quadratic Formula', 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e'),

    ('d1e2f3a4-b5c6-d7e8-f9a0-b1c2d3e4f5a6', 'Addition, Subtraction, Multiplication', 'f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('e2f3a4b5-c6d7-e8f9-a0b1-c2d3e4f5a6b7', 'Substitution Method', 'd5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0'),
    ('f3a4b5c6-d7e8-f9a0-b1c2-d3e4f5a6b7c8', 'Elimination Method', 'd5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0'),
    ('a4b5c6d7-e8f9-a0b1-c2d3-e4f5a6b7c8d9', 'Graphical Method', 'd5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0')
    ON CONFLICT (id) DO NOTHING;


--- HISTORY OF THE TURKISH REVOLUTION TOPICS
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('a5b6c7d8-e9f0-1234-5678-90abcdef0123', 'Introduction to the Revolution', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('b6c7d8e9-f012-3456-7890-abcdef012345', 'The Period of World War I and Armistices', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('c7d8e9f0-1234-5678-90ab-cdef01234567', 'The National Struggle (Kurtuluş Savaşı)', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('d8e9f012-3456-7890-abcd-ef0123456789', 'The Regular Army and Major Battles', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('e9f01234-5678-90ab-cdef-0123456789ab', 'The Proclamation of the Republic and Revolutions (İnkılaplar)', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('f0123456-7890-abcd-ef01-23456789abcd', 'Atatürk''s Foreign Policy', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('01234567-89ab-cdef-0123-456789abcdef', 'Conclusion of the Revolution Period', '529314fc-a65c-44a9-ada7-f5cc12c8a664')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('12345678-9abc-def0-1234-567890abcdef', 'Definition and Scope of Revolution', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('23456789-abcd-ef01-2345-67890abcdef0', 'Causes and Background of the Ottoman Empire''s Decline', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('6406b56f-2480-47a4-9604-37d967b5556e', 'Westernization Movements in the Ottoman Empire (Tanzimat, Islahat)', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('34567890-bcde-f012-3456-7890abcdef01', 'Rise of Nationalism and the Idea of Turkism', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),

    ('45678901-cdef-0123-4567-890abcdef012', 'Ottoman Empire''s Entry into WWI and Its Consequences', 'b6c7d8e9-f012-3456-7890-abcdef012345'),
    ('56789012-def0-1234-5678-90abcdef0123', 'The Mondros Armistice (October 30, 1918)', 'b6c7d8e9-f012-3456-7890-abcdef012345'),
    ('67890123-ef01-2345-6789-0abcdef01234', 'Occupation of Anatolia and Establishment of Resistance Organizations (Kuvâ-yi Milliye)', 'b6c7d8e9-f012-3456-7890-abcdef012345'),
    ('78901234-f012-3456-7890-abcdef012345', 'Societies and Organizations Formed During the Occupation', 'b6c7d8e9-f012-3456-7890-abcdef012345'),

    ('89012345-0123-4567-890a-bcdef0123456', 'Mustafa Kemal Atatürk''s Arrival in Samsun (May 19, 1919)', 'c7d8e9f0-1234-5678-90ab-cdef01234567'),
    ('90123456-1234-5678-90ab-cdef01234567', 'Amasya Circular (Amasya Genelgesi)', 'c7d8e9f0-1234-5678-90ab-cdef01234567'),
    ('01234567-2345-6789-0abc-def012345678', 'Erzurum Congress (Erzurum Kongresi)', 'c7d8e9f0-1234-5678-90ab-cdef01234567'),
    ('12345678-3456-7890-abcd-ef0123456789', 'Sivas Congress (Sivas Kongresi)', 'c7d8e9f0-1234-5678-90ab-cdef01234567'),
    ('23456789-4567-890a-bcde-f0123456789a', 'Establishment of the Representative Committee (Heyet-i Temsiliye)', 'c7d8e9f0-1234-5678-90ab-cdef01234567'),
    ('34567890-5678-90ab-cdef-0123456789ab', 'Opening of the Grand National Assembly of Turkey (TBMM) (April 23, 1920)', 'c7d8e9f0-1234-5678-90ab-cdef01234567'),

    ('45678901-6789-0abc-def0-123456789abc', 'Southern Front (French and Armenian resistance)', 'd8e9f012-3456-7890-abcd-ef0123456789'),
    ('56789012-7890-abcd-ef01-23456789abcd', 'Eastern Front (War with Armenia)', 'd8e9f012-3456-7890-abcd-ef0123456789'),
    ('67890123-890a-bcde-f012-3456789abcde', 'Western Front (War with Greece)', 'd8e9f012-3456-7890-abcd-ef0123456789'),
    ('78901234-90ab-cdef-0123-456789abcdef', 'Mudanya Armistice (Mudanya Mütarekesi)', 'd8e9f012-3456-7890-abcd-ef0123456789'),
    ('89012345-abcd-ef01-2345-6789abcdef01', 'Treaty of Lausanne (Lozan Barış Antlaşması)', 'd8e9f012-3456-7890-abcd-ef0123456789'),

    ('90123456-bcde-f012-3456-789abcdef012', 'Abolition of the Sultanate (Saltanatın Kaldırılması)', 'e9f01234-5678-90ab-cdef-0123456789ab'),
    ('01234567-cdef-0123-4567-89abcdef0123', 'Proclamation of the Republic (Cumhuriyetin İlanı) (October 29, 1923)', 'e9f01234-5678-90ab-cdef-0123456789ab'),
    ('12345678-def0-1234-5678-90abcdef0123', 'Abolition of the Caliphate (Hilafetin Kaldırılması)', 'e9f01234-5678-90ab-cdef-0123456789ab'),
    ('23456789-ef01-2345-6789-0abcdef01234', 'Atatürk''s Principles (Atatürk İlkeleri)', 'e9f01234-5678-90ab-cdef-0123456789ab'),
    ('34567890-f012-3456-7890-abcdef012345', 'Major Reforms/Revolutions', 'e9f01234-5678-90ab-cdef-0123456789ab'),

    ('45678901-0123-4567-890a-bcdef0123456', 'Principles of Foreign Policy', 'f0123456-7890-abcd-ef01-23456789abcd'),
    ('56789012-1234-5678-90ab-cdef01234567', 'Key International Agreements and Alliances', 'f0123456-7890-abcd-ef01-23456789abcd'),

    ('67890123-2345-6789-0abc-def012345678', 'Death of Atatürk and His Legacy', '01234567-89ab-cdef-0123-456789abcdef'),
    ('78901234-3456-7890-abcd-ef0123456789', 'The Republic after Atatürk', '01234567-89ab-cdef-0123-456789abcdef')
    ON CONFLICT (id) DO NOTHING;


INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('89012345-4567-890a-bcde-f0123456789a', 'First Battle of İnönü', '67890123-890a-bcde-f012-3456789abcde'),
    ('90123456-5678-90ab-cdef-0123456789ab', 'Second Battle of İnönü', '67890123-890a-bcde-f012-3456789abcde'),
    ('01234567-6789-0abc-def0-123456789abc', 'Battle of Kütahya-Eskişehir', '67890123-890a-bcde-f012-3456789abcde'),
    ('12345678-7890-abcd-ef01-23456789abcd', 'Battle of Sakarya (Sakarya Meydan Muharebesi)', '67890123-890a-bcde-f012-3456789abcde'),
    ('23456789-890a-bcde-f012-3456789abcde', 'Great Offensive and Battle of Dumlupınar (Büyük Taarruz ve Başkomutanlık Meydan Muharebesi)', '67890123-890a-bcde-f012-3456789abcde')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('34567890-90ab-cdef-0123-456789abcdef', 'Republicanism (Cumhuriyetçilik)', '23456789-ef01-2345-6789-0abcdef01234'),
    ('45678901-abcd-ef01-2345-6789abcdef01', 'Nationalism (Milliyetçilik)', '23456789-ef01-2345-6789-0abcdef01234'),
    ('56789012-bcde-f012-3456-789abcdef012', 'Populism (Halkçılık)', '23456789-ef01-2345-6789-0abcdef01234'),
    ('67890123-cdef-0123-4567-89abcdef0123', 'Secularism (Laiklik)', '23456789-ef01-2345-6789-0abcdef01234'),
    ('78901234-def0-1234-5678-90abcdef0123', 'Statism (Devletçilik)', '23456789-ef01-2345-6789-0abcdef01234'),
    ('89012345-ef01-2345-6789-0abcdef01234', 'Revolutionism/Reformism (İnkılapçılık)', '23456789-ef01-2345-6789-0abcdef01234')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('90123456-f012-3456-7890-abcdef012345', 'Legal Reforms (Law of Succession, Civil Code)', '34567890-f012-3456-7890-abcdef012345'),
    ('01234567-0123-4567-890a-bcdef0123456', 'Educational and Cultural Reforms (Unification of Education, Alphabet Revolution, Language and History Institutions)', '34567890-f012-3456-7890-abcdef012345'),
    ('12345678-1234-5678-90ab-cdef01234567', 'Social Reforms (Hat Law, Abolition of Titles, Women''s Rights)', '34567890-f012-3456-7890-abcdef012345'),
    ('23456789-2345-6789-0abc-def012345678', 'Economic Reforms (Agricultural, Industrial, Banking)', '34567890-f012-3456-7890-abcdef012345')
    ON CONFLICT (id) DO NOTHING;
-- Generated Questions
INSERT INTO question (id, text, topic_id, writer_id) VALUES
    ('a7b9c1d3-e5f7-8a9b-c0d2-e4f6a8b0c2d4', 'What is a core concept in Introduction to Algebra?', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432', '11111111-2222-3333-4444-555555555555'),
    ('b8c0d2e4-f6a8-9b0c-d1e3-f5a7b9c1d3e5', 'How do you solve Linear Equations in One Variable?', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '11111111-2222-3333-4444-555555555555'),
    ('c9d1e3f5-a7b9-0c1d-e2f4-a6b8c0d2e4f6', 'Which of these is a property of Exponents and Their Properties?', 'c8d9e0f1-a2b3-4c5d-6e7f-8a9b0c1d2e3f', '11111111-2222-3333-4444-555555555555'),
    ('dae2f4a6-b8c0-1d2e-3f4a-5b6c7d8e9f01', 'What event marked the beginning of The National Struggle (Kurtuluş Savaşı)?', 'c7d8e9f0-1234-5678-90ab-cdef01234567', '11111111-2222-3333-4444-555555555555'),
    ('ebf3a7b8-c9d0-2e3f-4a5b-6c7d8e9f0123', 'What is the significance of the Proclamation of the Republic?', 'e9f01234-5678-90ab-cdef-0123456789ab', '11111111-2222-3333-4444-555555555555'),
    ('fca4b8c9-d0e1-3f4a-5b6c-7d8e9f012345', 'A question about Linear Inequalities in One Variable.', 'c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f', '11111111-2222-3333-4444-555555555555'),
    ('0db5c9d0-e1f2-4a5b-6c7d-8e9f01234567', 'What is covered in Introduction to Polynomials and Basic Operations?', 'f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c', '11111111-2222-3333-4444-555555555555'),
    ('1ec6d0e1-f2a3-5b6c-7d8e-9f0123456789', 'Key facts about the Battle of Sakarya.', '12345678-7890-abcd-ef01-23456789abcd', '11111111-2222-3333-4444-555555555555'),
    ('2fd7e1f2-a3b4-6c7d-8e9f-0123456789ab', 'What does Populism (Halkçılık) entail?', '56789012-bcde-f012-3456-789abcdef012', '11111111-2222-3333-4444-555555555555'),
    ('30e8f2a3-b4c5-7d8e-9f01-23456789abcd', 'What defines Variables and Constants?', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '11111111-2222-3333-4444-555555555555'),
    ('41f9a3b4-c5d6-8e9f-0123-456789abcde0', 'How are Algebraic Expressions simplified?', '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '11111111-2222-3333-4444-555555555555'),
    ('520a4b5c-d6e7-9f01-2345-6789abcde0f1', 'A question on the Substitution Method for Systems of Equations.', 'e2f3a4b5-c6d7-e8f9-a0b1-c2d3e4f5a6b7', '11111111-2222-3333-4444-555555555555'),
    ('631b5c6d-e7f8-0123-4567-89abcde0f123', 'What is the purpose of the Discriminant in Quadratic Equations?', 'b9c0d1e2-f3a4-b5c6-d7e8-f9a0b1c2d3e4', '11111111-2222-3333-4444-555555555555'),
    ('742c6d7e-f8a9-1234-5678-9abcde0f1234', 'Explain the significance of The Mondros Armistice.', '56789012-def0-1234-5678-90abcdef0123', '11111111-2222-3333-4444-555555555555'),
    ('853d7e8f-a9b0-2345-6789-abcde0f12345', 'What were the major points of the Amasya Circular?', '90123456-1234-5678-90ab-cdef01234567', '11111111-2222-3333-4444-555555555555'),
    ('964e8f9a-b0c1-3456-789a-bcde0f123456', 'Which principle is central to Atatürk''s Foreign Policy?', '45678901-0123-4567-890a-bcdef0123456', '11111111-2222-3333-4444-555555555555'),
    ('a75f9a0b-c1d2-4567-89ab-cdef01234567', 'A question on Educational and Cultural Reforms.', '01234567-0123-4567-890a-bcdef0123456', '11111111-2222-3333-4444-555555555555'),
    ('b860a1b2-d2e3-5678-9abc-def012345678', 'What is a core concept in Equations?', '1f2e3d4c-5b6a-7f8e-9d0c-1b2a3f4e5d6c', '11111111-2222-3333-4444-555555555555'),
    ('c971b2c3-e3f4-6789-0bcd-ef0123456789', 'How are Terms and Coefficients defined?', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', '11111111-2222-3333-4444-555555555555'),
    ('da82c3d4-f4a5-7890-1cde-f0123456789a', 'What is involved in Polynomial Division?', 'a6b7c8d9-e0f1-2a3b-4c5d-6e7f8a9b0c1d', '11111111-2222-3333-4444-555555555555'),
    ('eb93d4e5-a5b6-8901-2def-0123456789ab', 'What is the role of the Representative Committee?', '23456789-4567-890a-bcde-f0123456789a', '11111111-2222-3333-4444-555555555555'),
    ('fca4e5f6-b6c7-9012-34ef-123456789abc', 'What happened in the First Battle of İnönü?', '89012345-4567-890a-bcde-f0123456789a', '11111111-2222-3333-4444-555555555555'),
    ('0db5f6a7-c7d8-0123-456f-23456789abcd', 'What does Statism (Devletçilik) mean?', '78901234-def0-1234-5678-90abcdef0123', '11111111-2222-3333-4444-555555555555'),
    ('1ec6a7b8-d8e9-1234-5670-3456789abcde', 'A question about Linear Equations in Two Variables.', 'a0b1c2d3-e4f5-6a7b-8c9d-0e1f2a3b4c5d', '11111111-2222-3333-4444-555555555555'),
    ('2fd7b8c9-e9f0-2345-6781-456789abcdef', 'What is covered in Absolute Value Inequalities?', 'd3e4f5a6-b7c8-9d0e-1f2a-3b4c5d6e7f8a', '11111111-2222-3333-4444-555555555555'),
    ('30e8c9d0-f0a1-3456-7892-56789abcdef0', 'What are Factoring Techniques in Polynomials?', 'b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e', '11111111-2222-3333-4444-555555555555'),
    ('41f9d0e1-a1b2-4567-8903-6789abcdef01', 'What is the significance of the Great Offensive and Battle of Dumlupınar?', '23456789-890a-bcde-f012-3456789abcde', '11111111-2222-3333-4444-555555555555'),
    ('520a1e2f-b2c3-5678-9014-789abcdef012', 'A question on Rational Exponents.', 'e0f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b', '11111111-2222-3333-4444-555555555555'),
    ('631b2f3a-c3d4-6789-0125-89abcdef0123', 'What does Nationalism (Milliyetçilik) represent?', '45678901-abcd-ef01-2345-6789abcdef01', '11111111-2222-3333-4444-555555555555'),
    ('742c3a4b-d4e5-7890-1236-9abcdef01234', 'What defines the scope of Revolution?', '12345678-9abc-def0-1234-567890abcdef', '11111111-2222-3333-4444-555555555555'),
    ('853d4b5c-e5f6-8901-2347-abcdef012345', 'What are the Causes and Background of the Ottoman Empire''s Decline?', '23456789-abcd-ef01-2345-67890abcdef0', '11111111-2222-3333-4444-555555555555'),
    ('964e5c6d-f6a7-9012-3458-bcdef0123456', 'What were the consequences of Ottoman Empire''s Entry into WWI?', '45678901-cdef-0123-4567-890abcdef012', '11111111-2222-3333-4444-555555555555'),
    ('a75f6d7e-a7b8-0123-4569-cdef01234567', 'Key outcomes of the Erzurum Congress.', '01234567-2345-6789-0abc-def012345678', '11111111-2222-3333-4444-555555555555'),
    ('b8607e8f-b8c9-1234-567a-def012345678', 'What happened on the Southern Front during the battles?', '45678901-6789-0abc-def0-123456789abc', '11111111-2222-3333-4444-555555555555'),
    ('c9718f9a-c9d0-2345-678b-ef0123456789', 'What reforms were part of the Legal Reforms?', '90123456-f012-3456-7890-abcdef012345', '11111111-2222-3333-4444-555555555555'),
    ('da829a0b-d0e1-3456-789c-f0123456789a', 'What is the role of the Quadratic Formula?', 'c0d1e2f3-a4b5-c6d7-e8f9-a0b1c2d3e4f5', '11111111-2222-3333-4444-555555555555'),
    ('eb930b1c-e1f2-4567-890d-0123456789ab', 'A question about Systems of Inequalities.', 'e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b', '11111111-2222-3333-4444-555555555555'),
    ('fca41c2d-f2a3-5678-901e-123456789abc', 'What is the importance of the Treaty of Lausanne?', '89012345-abcd-ef01-2345-6789abcdef01', '11111111-2222-3333-4444-555555555555'),
    ('0db52d3e-a3b4-6789-012f-23456789abcd', 'What are the main aspects of Economic Reforms?', '23456789-2345-6789-0abc-def012345678', '11111111-2222-3333-4444-555555555555'),
    ('1ec63e4f-b4c5-7890-1230-3456789abcde', 'What is covered in Introduction to Algebra?', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432', '11111111-2222-3333-4444-555555555555'),
    ('2fd74f5a-c5d6-8901-2341-456789abcdef', 'How do you solve Linear Equations in One Variable?', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '11111111-2222-3333-4444-555555555555'),
    ('30e85a6b-d6e7-9012-3452-56789abcdef0', 'Which of these is a property of Exponents and Their Properties?', 'c8d9e0f1-a2b3-4c5d-6e7f-8a9b0c1d2e3f', '11111111-2222-3333-4444-555555555555'),
    ('41f96b7c-e7f8-0123-4563-6789abcdef01', 'What event marked the beginning of The National Struggle (Kurtuluş Savaşı)?', 'c7d8e9f0-1234-5678-90ab-cdef01234567', '11111111-2222-3333-4444-555555555555'),
    ('520a7c8d-f8a9-1234-5674-789abcdef012', 'What is the significance of the Proclamation of the Republic?', 'e9f01234-5678-90ab-cdef-0123456789ab', '11111111-2222-3333-4444-555555555555'),
    ('631b8d9e-a9b0-2345-6785-89abcdef0123', 'A question about Linear Inequalities in One Variable.', 'c2d3e4f5-a6b7-8c9d-0e1f-2a3b4c5d6e7f', '11111111-2222-3333-4444-555555555555'),
    ('742c9e0f-b0c1-3456-7896-9abcdef01234', 'What is covered in Introduction to Polynomials and Basic Operations?', 'f5a6b7c8-d9e0-1f2a-3b4c-5d6e7f8a9b0c', '11111111-2222-3333-4444-555555555555'),
    ('853d0f1a-c1d2-4567-8907-abcdef012345', 'Key facts about the Battle of Sakarya.', '12345678-7890-abcd-ef01-23456789abcd', '11111111-2222-3333-4444-555555555555'),
    ('964e1a2b-d2e3-5678-9018-bcdef0123456', 'What does Populism (Halkçılık) entail?', '56789012-bcde-f012-3456-789abcdef012', '11111111-2222-3333-4444-555555555555'),
    ('a75f2b3c-e3f4-6789-0129-cdef01234567', 'What defines Variables and Constants?', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', '11111111-2222-3333-4444-555555555555'),
    ('b8603c4d-f4a5-7890-123a-def012345678', 'How are Algebraic Expressions simplified?', '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', '11111111-2222-3333-4444-555555555555'),
    ('c9714d5e-a5b6-8901-234b-ef0123456789', 'What is a core concept in Introduction to Algebra?', '0e9f8e7d-6c5b-4a32-10fe-dcba98765432', '11111111-2222-3333-4444-555555555555'),
    ('da825e6f-b6c7-9012-345c-f0123456789a', 'How do you solve Linear Equations in One Variable?', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', '11111111-2222-3333-4444-555555555555')
    ON CONFLICT (id) DO NOTHING;

-- Generated Options
INSERT INTO option (id, text, is_correct, question_id) VALUES
    ('d5e7f9a1-b3c5-7d9e-f1a3-b5c7d9e0f2a4', 'Variables', TRUE, 'a7b9c1d3-e5f7-8a9b-c0d2-e4f6a8b0c2d4'),
    ('e6f8a0b2-c4d6-8e9f-01b4-d6e8f0a2b4c6', 'Functions', FALSE, 'a7b9c1d3-e5f7-8a9b-c0d2-e4f6a8b0c2d4'),
    ('f7a9b1c3-d5e7-9f01-23c5-e7f9a1b3c5d7', 'Geometry', FALSE, 'a7b9c1d3-e5f7-8a9b-c0d2-e4f6a8b0c2d4'),
    ('08b0c2d4-e6f8-0a12-34d6-f8a0b2c4d6e8', 'Calculus', FALSE, 'a7b9c1d3-e5f7-8a9b-c0d2-e4f6a8b0c2d4'),
    ('19c1d3e5-f7a9-1b23-45e7-a9b1c3d5e7f9', 'Isolation of the variable', TRUE, 'b8c0d2e4-f6a8-9b0c-d1e3-f5a7b9c1d3e5'),
    ('2ad2e4f6-a8b0-2c34-56f8-b0c2d4e6f8a0', 'Graphing', FALSE, 'b8c0d2e4-f6a8-9b0c-d1e3-f5a7b9c1d3e5'),
    ('3be3f5a7-b9c1-3d45-67a9-c1d3e5f7a9b1', 'Substitution', FALSE, 'b8c0d2e4-f6a8-9b0c-d1e3-f5a7b9c1d3e5'),
    ('4cf4a6b8-c0d2-4e56-78b0-d2e4f6a8b0c2', 'Factoring', FALSE, 'b8c0d2e4-f6a8-9b0c-d1e3-f5a7b9c1d3e5'),
    ('5de5b7c9-d1e3-5f67-89c1-e3f5a7b9c1d3', 'Product of powers', TRUE, 'c9d1e3f5-a7b9-0c1d-e2f4-a6b8c0d2e4f6'),
    ('6ef6c8da-e2f4-6078-90d2-f4a6b8c0d2e4', 'Division by zero', FALSE, 'c9d1e3f5-a7b9-0c1d-e2f4-a6b8c0d2e4f6'),
    ('7fa7d9eb-f3a5-7189-01e3-a5b7c9d1e3f5', 'Negative base only', FALSE, 'c9d1e3f5-a7b9-0c1d-e2f4-a6b8c0d2e4f6'),
    ('80b8e0fc-a4b6-8290-12f4-b6c8d0e2f4a6', 'Sum of powers', FALSE, 'c9d1e3f5-a7b9-0c1d-e2f4-a6b8c0d2e4f6'),
    ('91c9f10d-b5c7-93a1-2305-c7d9e1f3a5b7', 'Mustafa Kemal Atatürk''s arrival in Samsun', TRUE, 'dae2f4a6-b8c0-1d2e-3f4a-5b6c7d8e9f01'),
    ('a2da021e-c6d8-04b2-3416-d8e0f2a4b6c8', 'Signing of the Treaty of Versailles', FALSE, 'dae2f4a6-b8c0-1d2e-3f4a-5b6c7d8e9f01'),
    ('b3eb132f-d7e9-15c3-4527-e9f1a3b5c7d9', 'The Armistice of Mudanya', FALSE, 'dae2f4a6-b8c0-1d2e-3f4a-5b6c7d8e9f01'),
    ('c4fc2430-e8fa-26d4-5638-f0a2b4c6d8e0', 'Formation of the Ottoman Parliament', FALSE, 'dae2f4a6-b8c0-1d2e-3f4a-5b6c7d8e9f01'),
    ('d50d3541-f9b0-37e5-6749-a1b3c5d7e9f1', 'Establishment of a democratic and secular state', TRUE, 'ebf3a7b8-c9d0-2e3f-4a5b-6c7d8e9f0123'),
    ('e61e4652-a0c1-48f6-785a-b2c4d6e8f0a2', 'Reinstatement of the Sultanate', FALSE, 'ebf3a7b8-c9d0-2e3f-4a5b-6c7d8e9f0123'),
    ('f72f5763-b1d2-5907-896b-c3d5e7f9a1b3', 'Increased foreign intervention', FALSE, 'ebf3a7b8-c9d0-2e3f-4a5b-6c7d8e9f0123'),
    ('08306874-c2e3-6a18-907c-d4e6f8a0b2c4', 'Expansion of the caliphate', FALSE, 'ebf3a7b8-c9d0-2e3f-4a5b-6c7d8e9f0123'),
    ('19417985-d3f4-7b29-018d-e5f7a9b1c3d5', 'Solving inequalities with one variable', TRUE, 'fca4b8c9-d0e1-3f4a-5b6c-7d8e9f012345'),
    ('2a528a96-e4a5-8c30-129e-f6a8b0c2d4e6', 'Graphing two-variable equations', FALSE, 'fca4b8c9-d0e1-3f4a-5b6c-7d8e9f012345'),
    ('3b639bab-f5b6-9d41-23af-07b9c1d3e5f7', 'Matrix operations', FALSE, 'fca4b8c9-d0e1-3f4a-5b6c-7d8e9f012345'),
    ('4c74a0bc-a6c7-a052-34b0-18d0e2f4a6b8', 'Complex number solutions', FALSE, 'fca4b8c9-d0e1-3f4a-5b6c-7d8e9f012345'),
    ('5d85b1cd-b7d8-b163-45c1-29e1f3a5b7c9', 'Addition and subtraction of polynomials', TRUE, '0db5c9d0-e1f2-4a5b-6c7d-8e9f01234567'),
    ('6e96c2de-c8e9-c274-56d2-3a02b4c6d8e0', 'Trigonometric functions', FALSE, '0db5c9d0-e1f2-4a5b-6c7d-8e9f01234567'),
    ('7f07d3ef-d9f0-d385-67e3-4b13c5d7e9f1', 'Differential equations', FALSE, '0db5c9d0-e1f2-4a5b-6c7d-8e9f01234567'),
    ('8018e40f-ea01-e496-78f4-5c24d6e8f0a2', 'Vector calculus', FALSE, '0db5c9d0-e1f2-4a5b-6c7d-8e9f01234567'),
    ('9129f510-fb12-f5a7-8905-6d35e7f9a1b3', 'Turkish victory against Greek forces', TRUE, '1ec6d0e1-f2a3-5b6c-7d8e-9f0123456789'),
    ('a23a0621-0c23-06b8-9016-7e46f8a0b2c4', 'Allied occupation of Istanbul', FALSE, '1ec6d0e1-f2a3-5b6c-7d8e-9f0123456789'),
    ('b34b1732-1d34-17c9-0127-8f57a9b1c3d5', 'Signing of the Treaty of Sèvres', FALSE, '1ec6d0e1-f2a3-5b6c-7d8e-9f0123456789'),
    ('c45c2843-2e45-28da-1238-9068b0c2d4e6', 'Founding of the Ottoman Bank', FALSE, '1ec6d0e1-f2a3-5b6c-7d8e-9f0123456789'),
    ('d56d3954-3f56-39eb-2349-a179c1d3e5f7', 'Governance for the benefit of the people', TRUE, '2fd7e1f2-a3b4-6c7d-8e9f-0123456789ab'),
    ('e67e4a65-4067-4a0c-345a-b28a02b4c6d8', 'Rule by a single dictator', FALSE, '2fd7e1f2-a3b4-6c7d-8e9f-0123456789ab'),
    ('f78f5b76-5178-5b1d-456b-c39b13c5d7e9', 'Religious fundamentalism', FALSE, '2fd7e1f2-a3b4-6c7d-8e9f-0123456789ab'),
    ('08906c87-6289-6c2e-567c-d4ac24d6f8a0', 'Economic protectionism', FALSE, '2fd7e1f2-a3b4-6c7d-8e9f-0123456789ab'),
    ('19a17d98-7390-7d3f-678d-e5bd35e7f9a1', 'Symbols that represent unknown values', TRUE, '30e8f2a3-b4c5-7d8e-9f01-23456789abcd'),
    ('2a3c1e5f-8401-8e50-789e-f6ce46f8a0b2', 'Numbers with fixed values', FALSE, '30e8f2a3-b4c5-7d8e-9f01-23456789abcd'),
    ('3b4d2f60-9512-9f61-890f-07de57f9a1b3', 'Operations signs', FALSE, '30e8f2a3-b4c5-7d8e-9f01-23456789abcd'),
    ('4c5e3071-a623-a072-9010-18ef68a0b2c4', 'Equation solutions', FALSE, '30e8f2a3-b4c5-7d8e-9f01-23456789abcd'),
    ('5d6f4182-b734-b183-0121-29f079b1c3d5', 'Combining like terms', TRUE, '41f9a3b4-c5d6-8e9f-0123-456789abcde0'),
    ('6e705293-c845-c294-1232-3a018a2b4c6d', 'Factoring polynomials', FALSE, '41f9a3b4-c5d6-8e9f-0123-456789abcde0'),
    ('7f816304-d956-d305-2343-4b129b3c5d7e', 'Using quadratic formula', FALSE, '41f9a3b4-c5d6-8e9f-0123-456789abcde0'),
    ('80927415-ea67-e416-3454-5c23a04d6e8f', 'Solving for exponents', FALSE, '41f9a3b4-c5d6-8e9f-0123-456789abcde0'),
    ('91a38526-fb78-f527-4565-6d34b15e7f90', 'Solving for one variable in terms of another', TRUE, '520a4b5c-d6e7-9f01-2345-6789abcde0f1'),
    ('a2b49637-0c89-0638-5676-7e45c26f8a01', 'Graphing linear functions', FALSE, '520a4b5c-d6e7-9f01-2345-6789abcde0f1'),
    ('b3c5a748-1d90-1749-6787-8f56d370e1f2', 'Using the quadratic formula', FALSE, '520a4b5c-d6e7-9f01-2345-6789abcde0f1'),
    ('c4d6b859-2ea1-285a-7898-9067e481f2a3', 'Finding derivatives', FALSE, '520a4b5c-d6e7-9f01-2345-6789abcde0f1'),
    ('d5e7c96a-3fb2-396b-8909-a178f59203b4', 'Determines the nature of the roots', TRUE, '631b5c6d-e7f8-0123-4567-89abcde0f123'),
    ('e6f8da7b-40c3-4a7c-901a-b289060314c5', 'Calculates the vertex of a parabola', FALSE, '631b5c6d-e7f8-0123-4567-89abcde0f123'),
    ('f7a9eb8c-51d4-5b8d-012b-c39a171425d6', 'Finds the x-intercepts', FALSE, '631b5c6d-e7f8-0123-4567-89abcde0f123'),
    ('08b0fc9d-62e5-6c9e-123c-d4ab282536e7', 'Simplifies square roots', FALSE, '631b5c6d-e7f8-0123-4567-89abcde0f123'),
    ('19c10d0e-73f6-7da0-234d-e5bc393647f8', 'The Ottoman surrender at the end of WWI', TRUE, '742c6d7e-f8a9-1234-5678-9abcde0f1234'),
    ('2a3c1e1f-8407-8eb1-345e-f6cd404758a9', 'The start of the Balkan Wars', FALSE, '742c6d7e-f8a9-1234-5678-9abcde0f1234'),
    ('3b4d2f20-9518-9fc2-456f-07de515869b0', 'The declaration of the Turkish Republic', FALSE, '742c6d7e-f8a9-1234-5678-9abcde0f1234'),
    ('4c5e3031-a629-a0d3-5670-18f062697a3c', 'The signing of the Treaty of Lausanne', FALSE, '742c6d7e-f8a9-1234-5678-9abcde0f1234'),
    ('5d6f4142-b73a-b1e4-6781-2901737a8b4d', 'Calling for national unity and resistance', TRUE, '853d7e8f-a9b0-2345-6789-abcde0f12345'),
    ('6e705253-c84b-c2f5-7892-3a12848b9c5e', 'Accepting foreign occupation', FALSE, '853d7e8f-a9b0-2345-6789-abcde0f12345'),
    ('7f816364-d95c-d306-8903-4b23959ca06f', 'Dissolving the national assembly', FALSE, '853d7e8f-a9b0-2345-6789-abcde0f12345'),
    ('80927475-ea6d-e417-9014-5c34a60da170', 'Forming a new Sultanate', FALSE, '853d7e8f-a9b0-2345-6789-abcde0f12345'),
    ('91a38586-fb7e-f528-0125-6d45b71eb281', 'Peace at home, peace in the world', TRUE, '964e8f9a-b0c1-3456-789a-bcde0f123456'),
    ('a2b49697-0c8f-0639-1236-7e56c82fc392', 'Aggressive expansionism', FALSE, '964e8f9a-b0c1-3456-789a-bcde0f123456'),
    ('b3c5a708-1d90-174a-2347-8f67d930d4a3', 'Colonial domination', FALSE, '964e8f9a-b0c1-3456-789a-bcde0f123456'),
    ('c4d6b819-2ea1-285b-3458-9078e041e5b4', 'Isolationism', FALSE, '964e8f9a-b0c1-3456-789a-bcde0f123456'),
    ('d5e7c92a-3fb2-396c-4569-a189f152f6c5', 'Alphabet Revolution', TRUE, 'a75f9a0b-c1d2-4567-89ab-cdef01234567'),
    ('e6f8da3b-40c3-4a7d-567a-b290026307d6', 'Military conscription', FALSE, 'a75f9a0b-c1d2-4567-89ab-cdef01234567'),
    ('f7a9eb4c-51d4-5b8e-678b-c3a1137418e7', 'Tax increases', FALSE, 'a75f9a0b-c1d2-4567-89ab-cdef01234567'),
    ('08b0fc5d-62e5-6c9f-789c-d4b2248529f8', 'Expansion of religious schools', FALSE, 'a75f9a0b-c1d2-4567-89ab-cdef01234567'),
    ('19c10d6e-73f6-7da0-890d-e5c335963a09', 'Understanding variables and constants', TRUE, 'b860a1b2-d2e3-5678-9abc-def012345678'),
    ('2a3c1e7f-8407-8eb1-901e-f6d446074b1a', 'Learning trigonometry', FALSE, 'b860a1b2-d2e3-5678-9abc-def012345678'),
    ('3b4d2f80-9518-9fc2-012f-07e557185c2b', 'Geometric proofs', FALSE, 'b860a1b2-d2e3-5678-9abc-def012345678'),
    ('4c5e3091-a629-a0d3-1230-18f668296d3c', 'Statistical analysis', FALSE, 'b860a1b2-d2e3-5678-9abc-def012345678'),
    ('5d6f41a2-b73a-b1e4-2341-2907793a7e4d', 'Parts of an algebraic expression', TRUE, 'c971b2c3-e3f4-6789-0bcd-ef0123456789'),
    ('6e7052b3-c84b-c2f5-3452-3a188a4b8f5e', 'Types of equations', FALSE, 'c971b2c3-e3f4-6789-0bcd-ef0123456789'),
    ('7f8163c4-d95c-d306-4563-4b299b5c906f', 'Rules for inequalities', FALSE, 'c971b2c3-e3f4-6789-0bcd-ef0123456789'),
    ('809274d5-ea6d-e417-5674-5c3a0c6d0170', 'Methods for graphing', FALSE, 'c971b2c3-e3f4-6789-0bcd-ef0123456789'),
    ('91a385e6-fb7e-f528-6785-6d4b1d7e1281', 'Long division of polynomials', TRUE, 'da82c3d4-f4a5-7890-1cde-f0123456789a'),
    ('a2b496f7-0c8f-0639-7896-7e5c2e8f2392', 'Synthetic division only', FALSE, 'da82c3d4-f4a5-7890-1cde-f0123456789a'),
    ('b3c5a708-1d90-174a-8907-8f6d3f9034a3', 'Factoring methods', FALSE, 'da82c3d4-f4a5-7890-1cde-f0123456789a'),
    ('c4d6b819-2ea1-285b-9018-907e40a145b4', 'Adding polynomials', FALSE, 'da82c3d4-f4a5-7890-1cde-f0123456789a'),
    ('d5e7c92a-3fb2-396c-0129-a18f51b256c5', 'Establishment of the Grand National Assembly', TRUE, 'eb93d4e5-a5b6-8901-2def-0123456789ab'),
    ('e6f8da3b-40c3-4a7d-123a-b29062c367d6', 'Signing of the Treaty of Sèvres', FALSE, 'eb93d4e5-a5b6-8901-2def-0123456789ab'),
    ('f7a9eb4c-51d4-5b8e-234b-c3a173d478e7', 'Foreign invasion of Izmir', FALSE, 'eb93d4e5-a5b6-8901-2def-0123456789ab'),
    ('08b0fc5d-62e5-6c9f-345c-d4b284e589f8', 'Foundation of the Ottoman Empire', FALSE, 'eb93d4e5-a5b6-8901-2def-0123456789ab'),
    ('19c10d6e-73f6-7da0-456d-e5c395f69a09', 'A strategic Turkish victory', TRUE, 'fca4e5f6-b6c7-9012-34ef-123456789abc'),
    ('2a3c1e7f-8407-8eb1-567e-f6d406070b1a', 'A major Greek offensive', FALSE, 'fca4e5f6-b6c7-9012-34ef-123456789abc'),
    ('3b4d2f80-9518-9fc2-678f-07e517181c2b', 'The defeat of Ottoman forces', FALSE, 'fca4e5f6-b6c7-9012-34ef-123456789abc'),
    ('4c5e3091-a629-a0d3-7890-18f628292d3c', 'A diplomatic agreement', FALSE, 'fca4e5f6-b6c7-9012-34ef-123456789abc'),
    ('5d6f41a2-b73a-b1e4-8901-2907393a3e4d', 'State control over the economy', TRUE, '0db5f6a7-c7d8-0123-456f-23456789abcd'),
    ('6e7052b3-c84b-c2f5-9012-3a184a4b4f5e', 'Complete privatization', FALSE, '0db5f6a7-c7d8-0123-456f-23456789abcd'),
    ('7f8163c4-d95c-d306-0123-4b295b5c506f', 'Free market policies', FALSE, '0db5f6a7-c7d8-0123-456f-23456789abcd'),
    ('809274d5-ea6d-e417-1234-5c3a6c6d6170', 'Limited government intervention', FALSE, '0db5f6a7-c7d8-0123-456f-23456789abcd'),
    ('91a385e6-fb7e-f528-2345-6d4b7d7e7281', 'Solving systems of two linear equations', TRUE, '1ec6a7b8-d8e9-1234-5670-3456789abcde'),
    ('a2b496f7-0c8f-0639-3456-7e5c8e8f8392', 'Understanding exponents', FALSE, '1ec6a7b8-d8e9-1234-5670-3456789abcde'),
    ('b3c5a708-1d90-174a-4567-8f6d9f9094a3', 'Factoring quadratic expressions', FALSE, '1ec6a7b8-d8e9-1234-5670-3456789abcde'),
    ('c4d6b819-2ea1-285b-5678-907e0a0b05b4', 'Simplifying radical expressions', FALSE, '1ec6a7b8-d8e9-1234-5670-3456789abcde'),
    ('d5e7c92a-3fb2-396c-6789-a18f1b1c16c5', 'Inequalities involving absolute values', TRUE, '2fd7b8c9-e9f0-2345-6781-456789abcdef'),
    ('e6f8da3b-40c3-4a7d-7890-b2902c2d27d6', 'Basic linear equations', FALSE, '2fd7b8c9-e9f0-2345-6781-456789abcdef'),
    ('f7a9eb4c-51d4-5b8e-8901-c3a13d3e38e7', 'System of linear equations', FALSE, '2fd7b8c9-e9f0-2345-6781-456789abcdef'),
    ('08b0fc5d-62e5-6c9f-9012-d4b24e4f49f8', 'Polynomial long division', FALSE, '2fd7b8c9-e9f0-2345-6781-456789abcdef'),
    ('19c10d6e-73f6-7da0-0123-e5c35f5g5a09', 'Grouping and difference of squares', TRUE, '30e8c9d0-f0a1-3456-7892-56789abcdef0'),
    ('2a3c1e7f-8407-8eb1-1234-f6d46h6i6b1a', 'Matrix inversion', FALSE, '30e8c9d0-f0a1-3456-7892-56789abcdef0'),
    ('3b4d2f80-9518-9fc2-2345-07e57i7j7c2b', 'Solving with graphing', FALSE, '30e8c9d0-f0a1-3456-7892-56789abcdef0'),
    ('4c5e3091-a629-a0d3-3456-18f68j8k8d3c', 'Completing the square', FALSE, '30e8c9d0-f0a1-3456-7892-56789abcdef0'),
    ('5d6f41a2-b73a-b1e4-4567-29079k9l9e4d', 'Final major battle for Turkish independence', TRUE, '41f9d0e1-a1b2-4567-8903-6789abcdef01'),
    ('6e7052b3-c84b-c2f5-5678-3a18a0a0a0f5', 'The capture of Istanbul', FALSE, '41f9d0e1-a1b2-4567-8903-6789abcdef01'),
    ('7f8163c4-d95c-d306-6789-4b29b1b1b106', 'A naval engagement', FALSE, '41f9d0e1-a1b2-4567-8903-6789abcdef01'),
    ('809274d5-ea6d-e417-7890-5c3a2c2c2177', 'A peace treaty negotiation', FALSE, '41f9d0e1-a1b2-4567-8903-6789abcdef01'),
    ('91a385e6-fb7e-f528-8901-6d4b3d3d3288', 'Exponents expressed as fractions', TRUE, '520a1e2f-b2c3-5678-9014-789abcdef012'),
    ('a2b496f7-0c8f-0639-9012-7e5c4e4e4399', 'Negative exponents', FALSE, '520a1e2f-b2c3-5678-9014-789abcdef012'),
    ('b3c5a708-1d90-174a-0123-8f6d5f5f54aa', 'Radical notation', FALSE, '520a1e2f-b2c3-5678-9014-789abcdef012'),
    ('c4d6b819-2ea1-285b-1234-907e606065bb', 'Scientific notation', FALSE, '520a1e2f-b2c3-5678-9014-789abcdef012'),
    ('d5e7c92a-3fb2-396c-2345-a18f717176cc', 'Emphasis on Turkish identity and culture', TRUE, '631b2f3a-c3d4-6789-0125-89abcdef0123'),
    ('e6f8da3b-40c3-4a7d-3456-b290828287dd', 'International alliances', FALSE, '631b2f3a-c3d4-6789-0125-89abcdef0123'),
    ('f7a9eb4c-51d4-5b8e-4567-c3a1939398ee', 'Religious governance', FALSE, '631b2f3a-c3d4-6789-0125-89abcdef0123'),
    ('08b0fc5d-62e5-6c9f-5678-d4b2a4a4a9ff', 'Economic liberalism', FALSE, '631b2f3a-c3d4-6789-0125-89abcdef0123'),
    ('19c10d6e-73f6-7da0-6789-e5c3b5b5ba00', 'Defining the limits and objectives of the new state', TRUE, '742c3a4b-d4e5-7890-1236-9abcdef01234'),
    ('2a3c1e7f-8407-8eb1-7890-f6d4c6c6cb11', 'Establishing a monarchy', FALSE, '742c3a4b-d4e5-7890-1236-9abcdef01234'),
    ('3b4d2f80-9518-9fc2-8901-07e5d7d7dc22', 'Joining a military bloc', FALSE, '742c3a4b-d4e5-7890-1236-9abcdef01234'),
    ('4c5e3091-a629-a0d3-9012-18f6e8e8ed33', 'Creating an empire', FALSE, '742c3a4b-d4e5-7890-1236-9abcdef01234'),
    ('5d6f41a2-b73a-b1e4-0123-2907f9f9f4e4', 'Internal weaknesses and external pressures', TRUE, '853d4b5c-e5f6-8901-2347-abcdef012345'),
    ('6e7052b3-c84b-c2f5-1234-3a180a0a05f5', 'Rapid industrialization', FALSE, '853d4b5c-e5f6-8901-2347-abcdef012345'),
    ('7f8163c4-d95c-d306-2345-4b291b1b1606', 'Colonial expansion', FALSE, '853d4b5c-e5f6-8901-2347-abcdef012345'),
    ('809274d5-ea6d-e417-3456-5c3a2c2c2717', 'Strong central government', FALSE, '853d4b5c-e5f6-8901-2347-abcdef012345'),
    ('91a385e6-fb7e-f528-4567-6d4b3d3d3828', 'Loss of territory and sovereignty', TRUE, '964e5c6d-f6a7-9012-3458-bcdef0123456'),
    ('a2b496f7-0c8f-0639-5678-7e5c4e4e4939', 'Economic boom', FALSE, '964e5c6d-f6a7-9012-3458-bcdef0123456'),
    ('b3c5a708-1d90-174a-6789-8f6d5f5f5a4a', 'Technological advancements', FALSE, '964e5c6d-f6a7-9012-3458-bcdef0123456'),
    ('c4d6b819-2ea1-285b-7890-907e60606b5b', 'Increased diplomatic influence', FALSE, '964e5c6d-f6a7-9012-3458-bcdef0123456'),
    ('d5e7c92a-3fb2-396c-8901-a18f71717c6c', 'Decision to establish a national assembly', TRUE, 'a75f6d7e-a7b8-0123-4569-cdef01234567'),
    ('e6f8da3b-40c3-4a7d-9012-b29082828d7d', 'Abdication of the Sultan', FALSE, 'a75f6d7e-a7b8-0123-4569-cdef01234567'),
    ('f7a9eb4c-51d4-5b8e-0123-c3a193939e8e', 'Signing of the Treaty of London', FALSE, 'a75f6d7e-a7b8-0123-4569-cdef01234567'),
    ('08b0fc5d-62e5-6c9f-1234-d4b2a4a4af9f', 'Declaration of war', FALSE, 'a75f6d7e-a7b8-0123-4569-cdef01234567'),
    ('19c10d6e-73f6-7da0-2345-e5c3b5b5b0a0', 'Resistance against French and Armenian forces', TRUE, 'b8607e8f-b8c9-1234-567a-def012345678'),
    ('2a3c1e7f-8407-8eb1-3456-f6d4c6c6c1b1', 'Conflict with the British', FALSE, 'b8607e8f-b8c9-1234-567a-def012345678'),
    ('3b4d2f80-9518-9fc2-4567-07e5d7d7d2c2', 'Battles against Greek invasion', FALSE, 'b8607e8f-b8c9-1234-567a-def012345678'),
    ('4c5e3091-a629-a0d3-5678-18f6e8e8e3d3', 'Negotiations with Russia', FALSE, 'b8607e8f-b8c9-1234-567a-def012345678'),
    ('5d6f41a2-b73a-b1e4-6789-2907f9f9f4e4', 'Adoption of a new Civil Code', TRUE, 'c9718f9a-c9d0-2345-678b-ef0123456789'),
    ('6e7052b3-c84b-c2f5-7890-3a180a0a05f5', 'Land redistribution', FALSE, 'c9718f9a-c9d0-2345-678b-ef0123456789'),
    ('7f8163c4-d95c-d306-8901-4b291b1b1606', 'Nationalization of industries', FALSE, 'c9718f9a-c9d0-2345-678b-ef0123456789'),
    ('809274d5-ea6d-e417-9012-5c3a2c2c2717', 'Creation of a new currency', FALSE, 'c9718f9a-c9d0-2345-678b-ef0123456789'),
    ('91a385e6-fb7e-f528-0123-6d4b3d3d3828', 'Providing solutions to quadratic equations', TRUE, 'da829a0b-d0e1-3456-789c-f0123456789a'),
    ('a2b496f7-0c8f-0639-1234-7e5c4e4e4939', 'Solving linear equations', FALSE, 'da829a0b-d0e1-3456-789c-f0123456789a'),
    ('b3c5a708-1d90-174a-2345-8f6d5f5f5a4a', 'Factoring polynomials', FALSE, 'da829a0b-d0e1-3456-789c-f0123456789a'),
    ('c4d6b819-2ea1-285b-3456-907e60606b5b', 'Graphing inequalities', FALSE, 'da829a0b-d0e1-3456-789c-f0123456789a'),
    ('d5e7c92a-3fb2-396c-4567-a18f71717c6c', 'Solving multiple inequalities simultaneously', TRUE, 'eb930b1c-e1f2-4567-890d-0123456789ab'),
    ('e6f8da3b-40c3-4a7d-5678-b29082828d7d', 'Solving single variable inequalities', FALSE, 'eb930b1c-e1f2-4567-890d-0123456789ab'),
    ('f7a9eb4c-51d4-5b8e-6789-c3a193939e8e', 'Factoring expressions', FALSE, 'eb930b1c-e1f2-4567-890d-0123456789ab'),
    ('08b0fc5d-62e5-6c9f-7890-d4b2a4a4af9f', 'Graphing linear equations', FALSE, 'eb930b1c-e1f2-4567-890d-0123456789ab'),
    ('19c10d6e-73f6-7da0-8901-e5c3b5b5b0a0', 'Recognition of Turkish sovereignty', TRUE, 'fca41c2d-f2a3-5678-901e-123456789abc'),
    ('2a3c1e7f-8407-8eb1-9012-f6d4c6c6c1b1', 'Establishment of a new caliphate', FALSE, 'fca41c2d-f2a3-5678-901e-123456789abc'),
    ('3b4d2f80-9518-9fc2-0123-07e5d7d7d2c2', 'Division of Anatolia', FALSE, 'fca41c2d-f2a3-5678-901e-123456789abc'),
    ('4c5e3091-a629-a0d3-1234-18f6e8e8e3d3', 'Return of Ottoman territories', FALSE, 'fca41c2d-f2a3-5678-901e-123456789abc'),
    ('5d6f41a2-b73a-b1e4-2345-2907f9f9f4e4', 'Encouraging private enterprise', FALSE, '0db52d3e-a3b4-6789-012f-23456789abcd'),
    ('6e7052b3-c84b-c2f5-3456-3a180a0a05f5', 'Nationalization of key industries', TRUE, '0db52d3e-a3b4-6789-012f-23456789abcd'),
    ('7f8163c4-d95c-d306-4567-4b291b1b1606', 'Promoting imports', FALSE, '0db52d3e-a3b4-6789-012f-23456789abcd'),
    ('809274d5-ea6d-e417-5678-5c3a2c2c2717', 'Deregulating markets', FALSE, '0db52d3e-a3b4-6789-012f-23456789abcd'),
    ('91a385e6-fb7e-f528-6789-6d4b3d3d3828', 'Variables', TRUE, '1ec63e4f-b4c5-7890-1230-3456789abcde'),
    ('a2b496f7-0c8f-0639-7890-7e5c4e4e4939', 'Functions', FALSE, '1ec63e4f-b4c5-7890-1230-3456789abcde'),
    ('b3c5a708-1d90-174a-8901-8f6d5f5f5a4a', 'Geometry', FALSE, '1ec63e4f-b4c5-7890-1230-3456789abcde'),
    ('c4d6b819-2ea1-285b-9012-907e60606b5b', 'Calculus', FALSE, '1ec63e4f-b4c5-7890-1230-3456789abcde'),
    ('d5e7c92a-3fb2-396c-0123-a18f71717c6c', 'Isolation of the variable', TRUE, '2fd74f5a-c5d6-8901-2341-456789abcdef'),
    ('e6f8da3b-40c3-4a7d-1234-b29082828d7d', 'Graphing', FALSE, '2fd74f5a-c5d6-8901-2341-456789abcdef'),
    ('f7a9eb4c-51d4-5b8e-2345-c3a193939e8e', 'Substitution', FALSE, '2fd74f5a-c5d6-8901-2341-456789abcdef'),
    ('08b0fc5d-62e5-6c9f-3456-d4b2a4a4af9f', 'Factoring', FALSE, '2fd74f5a-c5d6-8901-2341-456789abcdef'),
    ('19c10d6e-73f6-7da0-4567-e5c3b5b5b0a0', 'Product of powers', TRUE, '30e85a6b-d6e7-9012-3452-56789abcdef0'),
    ('2a3c1e7f-8407-8eb1-5678-f6d4c6c6c1b1', 'Division by zero', FALSE, '30e85a6b-d6e7-9012-3452-56789abcdef0'),
    ('3b4d2f80-9518-9fc2-6789-07e5d7d7d2c2', 'Negative base only', FALSE, '30e85a6b-d6e7-9012-3452-56789abcdef0'),
    ('4c5e3091-a629-a0d3-7890-18f6e8e8e3d3', 'Sum of powers', FALSE, '30e85a6b-d6e7-9012-3452-56789abcdef0'),
    ('5d6f41a2-b73a-b1e4-8901-2907f9f9f4e4', 'Mustafa Kemal Atatürk''s arrival in Samsun', TRUE, '41f96b7c-e7f8-0123-4563-6789abcdef01'),
    ('6e7052b3-c84b-c2f5-9012-3a180a0a05f5', 'Signing of the Treaty of Versailles', FALSE, '41f96b7c-e7f8-0123-4563-6789abcdef01'),
    ('7f8163c4-d95c-d306-0123-4b291b1b1606', 'The Armistice of Mudanya', FALSE, '41f96b7c-e7f8-0123-4563-6789abcdef01'),
    ('809274d5-ea6d-e417-1234-5c3a2c2c2717', 'Formation of the Ottoman Parliament', FALSE, '41f96b7c-e7f8-0123-4563-6789abcdef01'),
    ('91a385e6-fb7e-f528-2345-6d4b3d3d3828', 'Establishment of a democratic and secular state', TRUE, '520a7c8d-f8a9-1234-5674-789abcdef012'),
    ('a2b496f7-0c8f-0639-3456-7e5c4e4e4939', 'Reinstatement of the Sultanate', FALSE, '520a7c8d-f8a9-1234-5674-789abcdef012'),
    ('b3c5a708-1d90-174a-4567-8f6d5f5f5a4a', 'Increased foreign intervention', FALSE, '520a7c8d-f8a9-1234-5674-789abcdef012'),
    ('c4d6b819-2ea1-285b-5678-907e60606b5b', 'Expansion of the caliphate', FALSE, '520a7c8d-f8a9-1234-5674-789abcdef012'),
    ('d5e7c92a-3fb2-396c-6789-a18f71717c6c', 'Solving inequalities with one variable', TRUE, '631b8d9e-a9b0-2345-6785-89abcdef0123'),
    ('e6f8da3b-40c3-4a7d-7890-b29082828d7d', 'Graphing two-variable equations', FALSE, '631b8d9e-a9b0-2345-6785-89abcdef0123'),
    ('f7a9eb4c-51d4-5b8e-8901-c3a193939e8e', 'Matrix operations', FALSE, '631b8d9e-a9b0-2345-6785-89abcdef0123'),
    ('08b0fc5d-62e5-6c9f-9012-d4b2a4a4af9f', 'Complex number solutions', FALSE, '631b8d9e-a9b0-2345-6785-89abcdef0123'),
    ('19c10d6e-73f6-7da0-0123-e5c3b5b5b0a0', 'Addition and subtraction of polynomials', TRUE, '742c9e0f-b0c1-3456-7896-9abcdef01234'),
    ('2a3c1e7f-8407-8eb1-1234-f6d4c6c6c1b1', 'Trigonometric functions', FALSE, '742c9e0f-b0c1-3456-7896-9abcdef01234'),
    ('3b4d2f80-9518-9fc2-2345-07e5d7d7d2c2', 'Differential equations', FALSE, '742c9e0f-b0c1-3456-7896-9abcdef01234'),
    ('4c5e3091-a629-a0d3-3456-18f6e8e8e3d3', 'Vector calculus', FALSE, '742c9e0f-b0c1-3456-7896-9abcdef01234'),
    ('5d6f41a2-b73a-b1e4-4567-2907f9f9f4e4', 'Turkish victory against Greek forces', TRUE, '853d0f1a-c1d2-4567-8907-abcdef012345'),
    ('6e7052b3-c84b-c2f5-5678-3a180a0a05f5', 'Allied occupation of Istanbul', FALSE, '853d0f1a-c1d2-4567-8907-abcdef012345'),
    ('7f8163c4-d95c-d306-6789-4b291b1b1606', 'Signing of the Treaty of Sèvres', FALSE, '853d0f1a-c1d2-4567-8907-abcdef012345'),
    ('809274d5-ea6d-e417-7890-5c3a2c2c2717', 'Founding of the Ottoman Bank', FALSE, '853d0f1a-c1d2-4567-8907-abcdef012345'),
    ('91a385e6-fb7e-f528-8901-6d4b3d3d3828', 'Governance for the benefit of the people', TRUE, '964e1a2b-d2e3-5678-9018-bcdef0123456'),
    ('a2b496f7-0c8f-0639-9012-7e5c4e4e4939', 'Rule by a single dictator', FALSE, '964e1a2b-d2e3-5678-9018-bcdef0123456'),
    ('b3c5a708-1d90-174a-0123-8f6d5f5f5a4a', 'Religious fundamentalism', FALSE, '964e1a2b-d2e3-5678-9018-bcdef0123456'),
    ('c4d6b819-2ea1-285b-1234-907e60606b5b', 'Economic protectionism', FALSE, '964e1a2b-d2e3-5678-9018-bcdef0123456'),
    ('d5e7c92a-3fb2-396c-2345-a18f71717c6c', 'Symbols that represent unknown values', TRUE, 'a75f2b3c-e3f4-6789-0129-cdef01234567'),
    ('e6f8da3b-40c3-4a7d-3456-b29082828d7d', 'Numbers with fixed values', FALSE, 'a75f2b3c-e3f4-6789-0129-cdef01234567'),
    ('f7a9eb4c-51d4-5b8e-4567-c3a193939e8e', 'Operations signs', FALSE, 'a75f2b3c-e3f4-6789-0129-cdef01234567'),
    ('08b0fc5d-62e5-6c9f-5678-d4b2a4a4af9f', 'Equation solutions', FALSE, 'a75f2b3c-e3f4-6789-0129-cdef01234567'),
    ('19c10d6e-73f6-7da0-6789-e5c3b5b5b0a0', 'Combining like terms', TRUE, 'b8603c4d-f4a5-7890-123a-def012345678'),
    ('2a3c1e7f-8407-8eb1-7890-f6d4c6c6c1b1', 'Factoring polynomials', FALSE, 'b8603c4d-f4a5-7890-123a-def012345678'),
    ('3b4d2f80-9518-9fc2-8901-07e5d7d7d2c2', 'Using quadratic formula', FALSE, 'b8603c4d-f4a5-7890-123a-def012345678'),
    ('4c5e3091-a629-a0d3-9012-18f6e8e8e3d3', 'Solving for exponents', FALSE, 'b8603c4d-f4a5-7890-123a-def012345678'),
    ('5d6f41a2-b73a-b1e4-0123-2907f9f9f4e4', 'Variables', TRUE, 'c9714d5e-a5b6-8901-234b-ef0123456789'),
    ('6e7052b3-c84b-c2f5-1234-3a180a0a05f5', 'Functions', FALSE, 'c9714d5e-a5b6-8901-234b-ef0123456789'),
    ('7f8163c4-d95c-d306-2345-4b291b1b1606', 'Geometry', FALSE, 'c9714d5e-a5b6-8901-234b-ef0123456789'),
    ('809274d5-ea6d-e417-3456-5c3a2c2c2717', 'Calculus', FALSE, 'c9714d5e-a5b6-8901-234b-ef0123456789'),
    ('91a385e6-fb7e-f528-4567-6d4b3d3d3828', 'Isolation of the variable', TRUE, 'da825e6f-b6c7-9012-345c-f0123456789a'),
    ('a2b496f7-0c8f-0639-5678-7e5c4e4e4939', 'Graphing', FALSE, 'da825e6f-b6c7-9012-345c-f0123456789a'),
    ('b3c5a708-1d90-174a-6789-8f6d5f5f5a4a', 'Substitution', FALSE, 'da825e6f-b6c7-9012-345c-f0123456789a'),
    ('c4d6b819-2ea1-285b-7890-907e60606b5b', 'Factoring', FALSE, 'da825e6f-b6c7-9012-345c-f0123456789a')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz (id, name, topic_id, writer_id) VALUES
    ('0c1861a2-2b60-4ce2-bc80-2214ac783a07', 'Test1', '6406b56f-2480-47a4-9604-37d967b5556e', '37318be1-2d85-491d-8a19-8618b9256045'),
    ('8bfb4bea-e842-4ce0-82bf-58b1099c0b02', 'Functions', '6406b56f-2480-47a4-9604-37d967b5556e', '37318be1-2d85-491d-8a19-8618b9256045')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_question (quiz_id, question_id, question_no) VALUES
    ('0c1861a2-2b60-4ce2-bc80-2214ac783a07', '1ec6d0e1-f2a3-5b6c-7d8e-9f0123456789', 1),
    ('0c1861a2-2b60-4ce2-bc80-2214ac783a07', '853d7e8f-a9b0-2345-6789-abcde0f12345', 2),
    ('0c1861a2-2b60-4ce2-bc80-2214ac783a07', '2fd7b8c9-e9f0-2345-6781-456789abcdef', 3),
    ('8bfb4bea-e842-4ce0-82bf-58b1099c0b02', 'b860a1b2-d2e3-5678-9abc-def012345678', 1),
    ('8bfb4bea-e842-4ce0-82bf-58b1099c0b02', 'da825e6f-b6c7-9012-345c-f0123456789a', 2),
    ('8bfb4bea-e842-4ce0-82bf-58b1099c0b02', '2fd7b8c9-e9f0-2345-6781-456789abcdef', 3)
ON CONFLICT (quiz_id, question_id) DO NOTHING;

INSERT INTO homework (id, name, classroom_id, deadline) VALUES
    ('c435b74f-98dc-4ce3-a043-a7b46ec6411a', 'HW1', '6afc06b9-8b54-4ae8-ad61-21afb5541b6c', '2025-08-15T20:59:59Z'),
    ('96bdad4a-79d1-496b-b159-9d235906740c', 'HW2', '6afc06b9-8b54-4ae8-ad61-21afb5541b6c', '2025-08-15T23:59:59+03:00[Europe/Istanbul]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO homework_quiz (homework_id, quiz_id) VALUES
    ('c435b74f-98dc-4ce3-a043-a7b46ec6411a', '0c1861a2-2b60-4ce2-bc80-2214ac783a07'),
    ('c435b74f-98dc-4ce3-a043-a7b46ec6411a', '8bfb4bea-e842-4ce0-82bf-58b1099c0b02'),
    ('96bdad4a-79d1-496b-b159-9d235906740c', '8bfb4bea-e842-4ce0-82bf-58b1099c0b02')
;

INSERT INTO student (id, first_name, last_name, email, phone_number, registration_date) VALUES
    ('02ce1001-197a-420a-b88d-7f60c0646020', 'Sumeyye', 'Sakar', 'elif.demir@studyhub.com', '5301234567', CURRENT_TIMESTAMP),
    ('f3087d3e-d436-489e-ba96-fc8b36e71582', 'Burak', 'Can', 'burak.can@studyhub.com', '5329876543', CURRENT_TIMESTAMP),
    ('253493d6-0cf0-4b3b-a2db-e189abee4e6d', 'Zeynep', 'Kaya', 'zeynep.kaya@studyhub.com', '5351122334', CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO NOTHING;


INSERT INTO classroom_student (classroom_id, student_id) VALUES
    ('6afc06b9-8b54-4ae8-ad61-21afb5541b6c', '02ce1001-197a-420a-b88d-7f60c0646020'),
    ('6afc06b9-8b54-4ae8-ad61-21afb5541b6c', 'f3087d3e-d436-489e-ba96-fc8b36e71582'),
    ('6afc06b9-8b54-4ae8-ad61-21afb5541b6c', '253493d6-0cf0-4b3b-a2db-e189abee4e6d')
;