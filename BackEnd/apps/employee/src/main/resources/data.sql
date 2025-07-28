DELETE FROM option;
DELETE FROM question;
DELETE FROM classroom;
DELETE FROM topic;
DELETE FROM teacher;
DELETE FROM writer;

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
    ('class_sci_101_uuid', 'SCI101', 'General Science', 'f3087d3e-d436-489e-ba96-fc8b36e71582')
    ON CONFLICT (id) DO NOTHING;

--Writer
INSERT INTO writer (id, first_name, last_name, email, phone_number, registration_date) VALUES
    ('37318be1-2d85-491d-8a19-8618b9256045', 'Serkan', 'Yilmaz', 'serkan.yilmaz@studyhub.com', '5401112233', CURRENT_TIMESTAMP),
    ('74094d8b-c2b9-49d1-9402-6d04f2743be3', 'Deniz', 'Çelik', 'deniz.celik@studyhub.com', '5429988776', CURRENT_TIMESTAMP),
    ('5adee6b9-da8d-4039-8f5c-11c0d3255c09', 'Asli', 'Mansur', 'asli.mansur@studyhub.com', '5429985556', CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO NOTHING;

--Topic
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('ALG_ROOT', 'Algebra', NULL),
    ('529314fc-a65c-44a9-ada7-f5cc12c8a664', 'History of the Turkish Revolution', NULL)
    ON CONFLICT (id) DO NOTHING;

-- ALGEBRA TOPICS
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('ALG_INTRO', 'Introduction to Algebra', 'ALG_ROOT'),
    ('ALG_EQ', 'Equations', 'ALG_ROOT'),
    ('ALG_INEQ', 'Inequalities', 'ALG_ROOT'),
    ('ALG_POLY', 'Polynomials', 'ALG_ROOT'),
    ('ALG_EXP_RAD', 'Exponents and Radicals', 'ALG_ROOT')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('ALG_INTRO_VAR_CONST', 'Variables and Constants', 'ALG_INTRO'),
    ('ALG_INTRO_ALG_EXPR', 'Algebraic Expressions', 'ALG_INTRO'),
    ('ALG_INTRO_TERMS_COEFF', 'Terms and Coefficients', 'ALG_INTRO'),
    ('ALG_INTRO_SIMPLIFY', 'Simplifying Algebraic Expressions', 'ALG_INTRO'),

    ('ALG_EQ_LIN_ONE_VAR', 'Linear Equations in One Variable', 'ALG_EQ'),
    ('ALG_EQ_LIN_TWO_VAR', 'Linear Equations in Two Variables', 'ALG_EQ'),
    ('ALG_EQ_QUAD', 'Quadratic Equations', 'ALG_EQ'),

    ('ALG_INEQ_LIN_ONE_VAR', 'Linear Inequalities in One Variable', 'ALG_INEQ'),
    ('ALG_INEQ_ABS_VAL', 'Absolute Value Inequalities', 'ALG_INEQ'),
    ('ALG_INEQ_SYS', 'Systems of Inequalities', 'ALG_INEQ'),

    ('ALG_POLY_INTRO_OPS', 'Introduction to Polynomials and Basic Operations', 'ALG_POLY'),
    ('ALG_POLY_DIV', 'Polynomial Division', 'ALG_POLY'),
    ('ALG_POLY_FACT_TECH', 'Factoring Techniques', 'ALG_POLY'),

    ('ALG_EXP_RAD_EXP_PROP', 'Exponents and Their Properties', 'ALG_EXP_RAD'),
    ('ALG_EXP_RAD_RAD_PROP', 'Radicals and Their Properties', 'ALG_EXP_RAD'),
    ('ALG_EXP_RAD_RATIONAL', 'Rational Exponents', 'ALG_EXP_RAD')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('ALG_EQ_LIN_ONE_VAR_BASIC', 'Basic Solving Methods', 'ALG_EQ_LIN_ONE_VAR'),
    ('ALG_EQ_LIN_ONE_VAR_PAREN', 'Equations with Parentheses', 'ALG_EQ_LIN_ONE_VAR'),
    ('ALG_EQ_LIN_ONE_VAR_FRAC', 'Fractional Equations', 'ALG_EQ_LIN_ONE_VAR'),
    ('ALG_EQ_LIN_ONE_VAR_WORD', 'Word Problems', 'ALG_EQ_LIN_ONE_VAR'),

    ('ALG_EQ_LIN_TWO_VAR_SYS', 'Systems of Equations', 'ALG_EQ_LIN_TWO_VAR'),
    ('ALG_EQ_LIN_TWO_VAR_FUN_GRAPH', 'Linear Functions and Their Graphs', 'ALG_EQ_LIN_TWO_VAR'),

    ('ALG_EQ_QUAD_FACT', 'Factoring', 'ALG_EQ_QUAD'),
    ('ALG_EQ_QUAD_COMP_SQ', 'Completing the Square', 'ALG_EQ_QUAD'),
    ('ALG_EQ_QUAD_DISC', 'Discriminant', 'ALG_EQ_QUAD'),
    ('ALG_EQ_QUAD_FORM', 'Quadratic Formula', 'ALG_EQ_QUAD'),

    ('ALG_POLY_INTRO_OPS_ASM', 'Addition, Subtraction, Multiplication', 'ALG_POLY_INTRO_OPS')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('ALG_EQ_LIN_TWO_VAR_SYS_SUB', 'Substitution Method', 'ALG_EQ_LIN_TWO_VAR_SYS'),
    ('ALG_EQ_LIN_TWO_VAR_SYS_ELI', 'Elimination Method', 'ALG_EQ_LIN_TWO_VAR_SYS'),
    ('ALG_EQ_LIN_TWO_VAR_SYS_GRAPH', 'Graphical Method', 'ALG_EQ_LIN_TWO_VAR_SYS')
    ON CONFLICT (id) DO NOTHING;


-- HISTORY OF THE TURKISH REVOLUTION TOPICS
INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('529314fc-a65c-44a9-ada7-f5cc12c8a664', 'Introduction to the Revolution', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_WWI_ARMISTICE', 'The Period of World War I and Armistices', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_NATIONAL_STRUGGLE', 'The National Struggle (Kurtuluş Savaşı)', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_BATTLES', 'The Regular Army and Major Battles', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_REPUBLIC_REVOLUTIONS', 'The Proclamation of the Republic and Revolutions (İnkılaplar)', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_FOREIGN_POLICY', 'Atatürk''s Foreign Policy', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_CONCLUSION', 'Conclusion of the Revolution Period', '529314fc-a65c-44a9-ada7-f5cc12c8a664')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('TR_INTRO_DEF', 'Definition and Scope of Revolution', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_INTRO_DECLINE_CAUSES', 'Causes and Background of the Ottoman Empire''s Decline', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('6406b56f-2480-47a4-9604-37d967b5556e', 'Westernization Movements in the Ottoman Empire (Tanzimat, Islahat)', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),
    ('TR_INTRO_NATIONALISM', 'Rise of Nationalism and the Idea of Turkism', '529314fc-a65c-44a9-ada7-f5cc12c8a664'),

    ('TR_WWI_CONSEQUENCE', 'Ottoman Empire''s Entry into WWI and Its Consequences', 'TR_WWI_ARMISTICE'),
    ('TR_WWI_MONDROS', 'The Mondros Armistice (October 30, 1918)', 'TR_WWI_ARMISTICE'),
    ('TR_WWI_OCCUPATION_RESISTANCE', 'Occupation of Anatolia and Establishment of Resistance Organizations (Kuvâ-yi Milliye)', 'TR_WWI_ARMISTICE'),
    ('TR_WWI_SOCIETIES', 'Societies and Organizations Formed During the Occupation', 'TR_WWI_ARMISTICE'),

    ('TR_NS_SAMSUN', 'Mustafa Kemal Atatürk''s Arrival in Samsun (May 19, 1919)', 'TR_NATIONAL_STRUGGLE'),
    ('TR_NS_AMASYA', 'Amasya Circular (Amasya Genelgesi)', 'TR_NATIONAL_STRUGGLE'),
    ('TR_NS_ERZURUM', 'Erzurum Congress (Erzurum Kongresi)', 'TR_NATIONAL_STRUGGLE'),
    ('TR_NS_SIVAS', 'Sivas Congress (Sivas Kongresi)', 'TR_NATIONAL_STRUGGLE'),
    ('TR_NS_REP_COMMITTEE', 'Establishment of the Representative Committee (Heyet-i Temsiliye)', 'TR_NATIONAL_STRUGGLE'),
    ('TR_NS_TBMM_OPENING', 'Opening of the Grand National Assembly of Turkey (TBMM) (April 23, 1920)', 'TR_NATIONAL_STRUGGLE'),

    ('TR_BATTLES_SOUTH', 'Southern Front (French and Armenian resistance)', 'TR_BATTLES'),
    ('TR_BATTLES_EAST', 'Eastern Front (War with Armenia)', 'TR_BATTLES'),
    ('TR_BATTLES_WEST', 'Western Front (War with Greece)', 'TR_BATTLES'),
    ('TR_BATTLES_MUDANYA', 'Mudanya Armistice (Mudanya Mütarekesi)', 'TR_BATTLES'),
    ('TR_BATTLES_LAUSANNE', 'Treaty of Lausanne (Lozan Barış Antlaşması)', 'TR_BATTLES'),

    ('TR_REPUBLIC_SULTANATE_ABOLITION', 'Abolition of the Sultanate (Saltanatın Kaldırılması)', 'TR_REPUBLIC_REVOLUTIONS'),
    ('TR_REPUBLIC_PROCLAMATION', 'Proclamation of the Republic (Cumhuriyetin İlanı) (October 29, 1923)', 'TR_REPUBLIC_REVOLUTIONS'),
    ('TR_REPUBLIC_CALIPHATE_ABOLITION', 'Abolition of the Caliphate (Hilafetin Kaldırılması)', 'TR_REPUBLIC_REVOLUTIONS'),
    ('TR_REPUBLIC_ATATURK_PRINCIPLES', 'Atatürk''s Principles (Atatürk İlkeleri)', 'TR_REPUBLIC_REVOLUTIONS'),
    ('TR_REPUBLIC_MAJOR_REFORMS', 'Major Reforms/Revolutions', 'TR_REPUBLIC_REVOLUTIONS'),

    ('TR_FOREIGN_POLICY_PRINCIPLES', 'Principles of Foreign Policy', 'TR_FOREIGN_POLICY'),
    ('TR_FOREIGN_POLICY_AGREEMENTS', 'Key International Agreements and Alliances', 'TR_FOREIGN_POLICY_AGREEMENTS'), -- Fixed: Parent should be TR_FOREIGN_POLICY
    ('TR_FOREIGN_POLICY_AGREEMENTS_ALT', 'Key International Agreements and Alliances', 'TR_FOREIGN_POLICY'), -- Alternative for fixing parent issue

    ('TR_CONCLUSION_DEATH_LEGACY', 'Death of Atatürk and His Legacy', 'TR_CONCLUSION'),
    ('TR_CONCLUSION_AFTER_ATATURK', 'The Republic after Atatürk', 'TR_CONCLUSION')
    ON CONFLICT (id) DO NOTHING;


INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('TR_BATTLES_WEST_INONU1', 'First Battle of İnönü', 'TR_BATTLES_WEST'),
    ('TR_BATTLES_WEST_INONU2', 'Second Battle of İnönü', 'TR_BATTLES_WEST'),
    ('TR_BATTLES_WEST_KUTAHYA', 'Battle of Kütahya-Eskişehir', 'TR_BATTLES_WEST'),
    ('TR_BATTLES_WEST_SAKARYA', 'Battle of Sakarya (Sakarya Meydan Muharebesi)', 'TR_BATTLES_WEST'),
    ('TR_BATTLES_WEST_DUMLUPINAR', 'Great Offensive and Battle of Dumlupınar (Büyük Taarruz ve Başkomutanlık Meydan Muharebesi)', 'TR_BATTLES_WEST')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('TR_REP_PRIN_REP', 'Republicanism (Cumhuriyetçilik)', 'TR_REPUBLIC_ATATURK_PRINCIPLES'),
    ('TR_REP_PRIN_NAT', 'Nationalism (Milliyetçilik)', 'TR_REPUBLIC_ATATURK_PRINCIPLES'),
    ('TR_REP_PRIN_POP', 'Populism (Halkçılık)', 'TR_REPUBLIC_ATATURK_PRINCIPLES'),
    ('TR_REP_PRIN_SEC', 'Secularism (Laiklik)', 'TR_REPUBLIC_ATATURK_PRINCIPLES'),
    ('TR_REP_PRIN_STAT', 'Statism (Devletçilik)', 'TR_REPUBLIC_ATATURK_PRINCIPLES'),
    ('TR_REP_PRIN_REV', 'Revolutionism/Reformism (İnkılapçılık)', 'TR_REPUBLIC_ATATURK_PRINCIPLES')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO topic (id, name, parent_topic_id) VALUES
    ('TR_REP_MAJ_REF_LEGAL', 'Legal Reforms (Law of Succession, Civil Code)', 'TR_REPUBLIC_MAJOR_REFORMS'),
    ('TR_REP_MAJ_REF_EDU_CULT', 'Educational and Cultural Reforms (Unification of Education, Alphabet Revolution, Language and History Institutions)', 'TR_REPUBLIC_MAJOR_REFORMS'),
    ('TR_REP_MAJ_REF_SOCIAL', 'Social Reforms (Hat Law, Abolition of Titles, Women''s Rights)', 'TR_REPUBLIC_MAJOR_REFORMS'),
    ('TR_REP_MAJ_REF_ECON', 'Economic Reforms (Agricultural, Industrial, Banking)', 'TR_REPUBLIC_MAJOR_REFORMS')
    ON CONFLICT (id) DO NOTHING;
