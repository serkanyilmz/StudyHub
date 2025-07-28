import type { BaseEntity } from "./common"

export interface Question extends BaseEntity {
  title: string
  content: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  status: "Published" | "Draft"
  views: number
}

export interface Quiz extends BaseEntity {
  title: string
  description?: string
  questions: Question[]
  category: string
  status: "Published" | "Draft"
  attempts: number
  timeLimit?: number
}

export interface QuizAttempt extends BaseEntity {
  quizId: string
  studentId: string
  score: number
  completedAt: string
  answers: Record<string, number>
}
