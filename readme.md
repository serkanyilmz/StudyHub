<br />
<div align="center">
  <a href="https://github.com/serkanyilmz/StudyHub">
    <img src="Frontend\public\studyhub-logo-white-txt.png" alt="StudyHub Logo"  width="400" height="132">
  </a>

  <h3 align="center">
    StudyHub
    <br />
    AI-Powered Learning Platform
    <br />
    <a href=""><strong>View Demo »</strong></a>
    <br />
    <h4>Developed for Hackathon 2025 by Drop Database</>
    <br />
    <a href="https://www.linkedin.com/in/erkimberk/">Erkim Berk Ünsal</a>
    &middot;
    <a href="https://www.linkedin.com/in/serkanyilm-z/">Serkan Yılmaz</a>
  </h3>
</div>

# StudyHub

StudyHub is a well-constructed AI-powered educatıonal platform for writers, teachers and students. The platform offers intelligent tools to automate and enrich content creation, classroom management, and student assessment.

## Features

### ✨ Artificial Intelligence Integration:

- Generating intelligent questions for any topic using AI

- AI-generated performance summaries for classes and individual students

- Question explanations after quizzes

### 📚 Rich Content Management:

- Organizing topics and sub-topics effectively

- A comprehensive interface for creating detailed questions and quizzes


### 👨‍🏫 Effective Classroom Management:

- Easily create and manage virtual classrooms.

- Assign homeworks with quizzes to classes with specific due dates.

- Track student performance in real-time.

### 👨🏻‍💻 Rich and Sustainable Development:

- Secure authentication with JWT tokens

- Fully Responsive and Cross-Platform FrontEnd Design

- Scalable, Maintable and Flexible BackEnd Design with Hexagonal Archictecture and Domain Driven Design (DDD)


## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/serkanyilmz/StudyHub.git
    ```
2. Starting BackEnd application:

    - Get your 
    <a href="https://aistudio.google.com/apikey">API Key</a>
    for use of Gemini API.
    - Create environmental variable for configuration:
      ```
      GOOGLE_API_KEY='your-api-key'
      ```
    - Run the Spring Boot application:
      ```bash
      cd .\BackEnd\
      .\gradlew.bat bootRun
      ```
3. Starting FrontEnd application:
    ```bash
    cd .\FrontEnd\
    npm install

    npm run dev
    ```

## Theme

The StudyHub logo and theme colors symbolizes a dynamic, AI-powered educational ecosystem that unites three key roles: the Writer, Teacher, and Student. Represented by three colored dots, the energetic orange signifies the creative Writer, the wise blue represents the guiding Teacher, and the vibrant green embodies the growing Student. Dark gray lines represent the seamless knowledge transfer from Writer → Teacher → Student. This entire interaction is framed by a light bluish-gray square, representing the intelligent and supportive AI foundation that personalizes and optimizes the entire learning process. 

<div align="center">
  <img src="Frontend\public\studyhub-banner.png" alt="StudyHub Theme Banner"  width="640" height="360">
</div>
<br/>

StudyHub is more than a tool—it's a dynamic, interconnected community where collaboration, knowledge, and AI converge.

## Next Features
- AI Chat Bot for all Users
###  Admin
- Admin page for statistics and approvement for registers of writers and teachers.
### Writer
- Bulk question and quiz upload from PDFs.
- Media attachments to questions
### Teacher
- AI-assisted grading insights
- Detailed AI analysises for students and classrooms
### Student
- Personalized study recommendations