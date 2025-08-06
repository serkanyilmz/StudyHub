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
    <a href="https://study-hub-5-lemon.vercel.app/"><strong>View Demo »</strong></a>
    <br />
    <h4>Developed for Hackathon 2025 by Drop Database</>
    <br />
    <a href="https://www.linkedin.com/in/erkimberk/">Erkim Berk Ünsal</a>
    &middot;
    <a href="https://www.linkedin.com/in/serkanyilm-z/">Serkan Yılmaz</a>
  </h3>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#studyhub">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#theme">Theme</a></li>
    <li><a href="#next-features">Next Features</a></li>
  </ol>
</details>


# StudyHub

StudyHub is a well-constructed AI-powered educatıonal platform for writers, teachers and students. The platform offers intelligent tools to automate and enrich content creation, classroom management and student assessment.

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

## Built With

* [![Spring Boot][Spring]][Spring-url]
* [![Docker][Docker]][Docker-url]
* [![PostgreSQL][Postgres]][Postgres-url]
* [![React][React.js]][React-url]
* [![Next][Next.js]][Next-url]
* [![Gemini API][Gemini]][Gemini-url]


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
      docker-compose up -d 
      .\gradlew.bat bootRun
      ```
3. Starting FrontEnd application:
    ```bash
    cd .\Frontend\
    npm install

    npm run dev
    ```

## Theme

The StudyHub logo and theme colors symbolizes a dynamic, AI-powered educational ecosystem that unites three key roles: the Writer, Teacher and Student. Represented by three colored dots, the energetic orange signifies the creative Writer, the wise blue represents the guiding Teacher and the vibrant green embodies the growing Student. Dark gray lines represent the seamless knowledge transfer from Writer → Teacher → Student. This entire interaction is framed by a light bluish-gray square, representing the intelligent and supportive AI foundation that personalizes and optimizes the entire learning process. 

<div align="center">
  <img src="Frontend\public\studyhub-banner.png" alt="StudyHub Theme Banner"  width="640" height="360">
</div>
<br/>

StudyHub is more than a tool—it's a dynamic, interconnected community where collaboration, knowledge and AI converge.

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


[Next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white
[Next-url]: https://nextjs.org/

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Spring]: https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white
[Spring-url]: https://spring.io/projects/spring-boot

[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/

[Postgres]: https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org/

[Gemini]: https://img.shields.io/badge/Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white
[Gemini-url]: https://ai.google.dev/
