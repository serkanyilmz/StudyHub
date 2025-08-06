class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
  private ensureValidTokenFn: (() => Promise<string | null>) | null = null

  // Method to set the token validation function from AuthContext
  setTokenValidator(fn: () => Promise<string | null>) {
    this.ensureValidTokenFn = fn
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let accessToken: string | null = null

    // Use AuthContext's ensureValidToken if available, otherwise fallback to localStorage
    if (this.ensureValidTokenFn) {
      accessToken = await this.ensureValidTokenFn()
    } else {
      accessToken = localStorage.getItem("accessToken")
    }

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)

    if (!response.ok) {
      // If we get 401 unauthorized, redirect to login
      if (response.status === 401) {
        console.log("Got 401, authentication failed...")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/auth/login"
        throw new Error("Authentication failed")
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }

    return response.text() as T
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request<{ accessToken: string; refreshToken: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, password: string, fullName: string, role: string) {
    return this.request<string>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, fullName, role }),
    })
  }

  // Topics
  async getTopics() {
    return this.request<any[]>("/topic")
  }

  async getTopic(id: string) {
    return this.request<any>(`/topic/${id}`)
  }

  async createTopic(data: { name: string; parentTopicId?: string }) {
    return this.request<any>("/topic", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTopic(id: string, data: { name: string; parentTopicId?: string }) {
    return this.request<any>(`/topic/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteTopic(id: string) {
    return this.request<any>(`/topic/${id}`, {
      method: "DELETE",
    })
  }

  // Questions
  async getQuestions() {
    return this.request<any[]>("/question")
  }

  async getQuestion(id: string) {
    return this.request<any>(`/question/${id}`)
  }

  async createQuestion(data: {
    text: string
    options: { text: string; isCorrect: boolean }[]
    topicId: string
    writerId: string
  }) {
    return this.request<any>("/question", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateQuestion(
    id: string,
    data: {
      text: string
      options: { text: string; isCorrect: boolean }[]
      topicId: string
      writerId: string
    },
  ) {
    return this.request<any>(`/question/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteQuestion(id: string) {
    return this.request<any>(`/question/${id}`, {
      method: "DELETE",
    })
  }

  async getAnswerExplanation(questionId: string) {
    return this.request<string>(`/question/ai/getAnswerExplanation/${questionId}`)
  }

  async getSampleQuestion(topicId: string) {
  return this.request<{ text: string; options: {
    text: string; correct: boolean 
}[] }>(
    `/question/ai/sampleQuestion?topicId=${topicId}`
  )
}

  // Quizzes
  async getQuizzes() {
    return this.request<any[]>("/quiz")
  }

  async getQuiz(id: string) {
    return this.request<any>(`/quiz/${id}`)
  }

  async createQuiz(data: {
    name: string
    quizQuestionCommandList: { questionId: string; questionNo: number }[]
    topicId: string
    writerId: string
  }) {
    return this.request<any>("/quiz", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateQuiz(
    id: string,
    data: {
      name: string
      quizQuestionCommandList: { questionId: string; questionNo: number }[]
      topicId: string
      writerId: string
    },
  ) {
    return this.request<any>(`/quiz/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteQuiz(id: string) {
    return this.request<any>(`/quiz/${id}`, {
      method: "DELETE",
    })
  }

  // Classrooms
  async getClassrooms() {
    return this.request<any[]>("/classroom")
  }

  async getClassroom(id: string) {
    return this.request<any>(`/classroom/${id}`)
  }

  async getStudentClassrooms(studentId: string) {
    return this.request<any[]>(`/classroom/student?studentId=${studentId}`)
  }

  async createClassroom(data: { code: string; name: string; teacherId: string }) {
    return this.request<any>("/classroom", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateClassroom(id: string, data: { code: string; name: string; teacherId: string }) {
    return this.request<any>(`/classroom/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteClassroom(id: string) {
    return this.request<any>(`/classroom/${id}`, {
      method: "DELETE",
    })
  }

  async addStudentToClassroom(classroomId: string, studentId: string) {
    return this.request<any>(`/classroom/${classroomId}/addStudent?studentId=${studentId}`, {
      method: "POST",
    })
  }

  // Homework
  async getHomeworkByClassroom(classroomId: string) {
    return this.request<any[]>(`/homework?classroomId=${classroomId}`)
  }

  async getHomework(id: string) {
    return this.request<any>(`/homework/${id}`)
  }

  async createHomework(data: {
    name: string
    quizIdList: string[]
    classroomId: string
    deadline: string
  }) {
    return this.request<any>("/homework", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateHomework(
    id: string,
    data: {
      name: string
      quizIdList: string[]
      classroomId: string
      deadline: string
    },
  ) {
    return this.request<any>(`/homework/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteHomework(id: string) {
    return this.request<any>(`/homework/${id}`, {
      method: "DELETE",
    })
  }

  // Students
  async getStudents() {
    return this.request<any[]>("/student")
  }

  async getStudent(id: string) {
    return this.request<any>(`/student/${id}`)
  }

 async getEnrolledStudents(classroomId: string) {
    return this.request<any[]>(`/student/classroom/${classroomId}`)
  }

  async createStudent(data: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }) {
    return this.request<any>("/student", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Teachers
  async getTeachers() {
    return this.request<any[]>("/teacher")
  }

  async getTeacher(id: string) {
    return this.request<any>(`/teacher/${id}`)
  }

  async getTeacherUniqueStudentsCount(teacherId: string) {
    return this.request<number>(`/teacher/${teacherId}/unique-students-count`)
  }

  async getTeacherClassroomStats(teacherId: string, classroomId: string) {
    return this.request<{
      averageScore: number
      completionRate: number
      totalStudents: number
      totalQuizzes: number
      completedQuizzes: number
    }>(`/teacher/${teacherId}/classroom/${classroomId}/stats`)
  }

  // Writers
  async getWriters() {
    return this.request<any[]>("/writer")
  }

  async getWriter(id: string) {
    return this.request<any>(`/writer/${id}`)
  }

  // Answers - Fixed to properly handle quiz completion and scoring
  async submitQuiz(answers: { questionId: string; optionId: string }[], studentId: string, quizId: string) {
    return this.request<number>(`/answer?studentId=${studentId}&quizId=${quizId}`, {
      method: "POST",
      body: JSON.stringify(answers),
    })
  }

  async getAnswers() {
    return this.request<any[]>("/answer")
  }

  async getAnswer(id: string) {
    return this.request<any>(`/answer/${id}`)
  }

  // Get student's answers for a specific quiz
  async getStudentQuizAnswers(studentId: string, quizId: string) {
    try {
      const allAnswers = await this.getAnswers()
      return allAnswers.filter((answer: any) => answer.student?.id === studentId && answer.quiz?.id === quizId)
    } catch (error) {
      console.error("Error fetching student quiz answers:", error)
      return []
    }
  }

  // // Check if student completed a quiz and get score
  // async getStudentQuizResult(studentId: string, quizId: string) {
  //   try {
  //     const answers = await this.getStudentQuizAnswers(studentId, quizId)
  //     if (answers.length === 0) {
  //       return { completed: false, score: 0 }
  //     }

  //     // Calculate score based on correct answers
  //     const correctAnswers = answers.filter((answer: any) => answer.isCorrect === true)
  //     const score = answers.length > 0 ? Math.round((correctAnswers.length / answers.length) * 100) : 0

  //     return { completed: true, score }
  //   } catch (error) {
  //     console.error("Error getting quiz result:", error)
  //     return { completed: false, score: 0 }
  //   }
  // }

  // Get all quiz results for a student using backend endpoints (optimized)
  async getStudentAllQuizResults(studentId: string) {
    try {
      // First get all quizzes to know what to check
      const allQuizzes = await this.getQuizzes()
      const quizResults: Record<string, { completed: boolean; score: number }> = {}

      // Check each quiz result using the backend endpoint
      for (const quiz of allQuizzes) {
        try {
          const result = await this.getStudentQuizResult(studentId, quiz.id)
          quizResults[quiz.id] = result
        } catch (error) {
          // If error, assume not completed
          quizResults[quiz.id] = { completed: false, score: 0 }
        }
      }

      return quizResults
    } catch (error) {
      console.error("Error getting all quiz results:", error)
      return {}
    }
  }
  
  async getQuizScore(studentId: string, quizId: string): Promise<number> {
    return this.request(`/answer/score?studentId=${studentId}&quizId=${quizId}`)
  }

 async getStudentQuizResult(studentId: string, quizId: string) {
  try {
    const answers = await this.getStudentAnswers(studentId, quizId)
    if (!answers || (Array.isArray(answers) && answers.length === 0)) {
      return { completed: false, score: 0 }
    }
    const score = await this.getQuizScore(studentId, quizId)
    return { completed: true, score }
  } catch (error) {
    return { completed: false, score: 0 }
  }
}

  async getStudentAnswers(studentId: string, quizId: string) {
    return this.request(`/answer/student/${studentId}/quiz/${quizId}`)
  }

  async getStudentProgress(studentId: string) {
    return this.request(`/answer/getStudentProgress/${studentId}`)
  }
}

export const api = new ApiClient()
