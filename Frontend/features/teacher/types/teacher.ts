import type { BaseEntity } from "@/shared/types/common"

export interface TeacherStats {
  activeClasses: number
  totalStudents: number
  assignmentsGiven: number
  avgPerformance: string
}

export interface StudentPerformance extends BaseEntity {
  student: string
  class: string
  quizzes: number
  avgScore: number
  trend: "up" | "down" | "stable"
}
