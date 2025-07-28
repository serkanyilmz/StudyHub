import type { BaseEntity } from "./common"

export interface Class extends BaseEntity {
  name: string
  code: string
  description?: string
  teacherId: string
  students: string[]
  assignments: string[]
  avgScore: number
}

export interface Assignment extends BaseEntity {
  title: string
  quizId: string
  classId: string
  dueDate: string
  submitted: number
  total: number
  avgScore: number
}
