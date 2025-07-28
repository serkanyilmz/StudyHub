import type { BaseEntity } from "@/shared/types/common"

export interface StudentStats {
  classesJoined: number
  quizzesCompleted: number
  averageScore: string
  studyStreak: string
}

export interface StudentClass extends BaseEntity {
  name: string
  teacher: string
  code: string
  progress: number
  nextQuiz: string
}

export interface StudentQuiz extends BaseEntity {
  title: string
  class: string
  dueDate: string
  status: "pending" | "completed"
  score: number | null
}

export interface PerformanceData {
  quiz: string
  score: number
  suggestions: string[]
}
