"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Users, BookOpen, TrendingUp, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Classroom {
  id: string
  name: string
  code: string
  teacher: {
    id: string
    firstName: string
    lastName: string
  }
}

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Homework {
  id: string
  name: string
  deadline: string
  quizzes: Array<{
    id: string
    name: string
  }>
}

interface StudentProgress {
  student: Student
  completedQuizzes: number
  totalQuizzes: number
  averageScore: number
  homeworkResults: Array<{
    homeworkId: string
    homeworkName: string
    completed: boolean
    score: number
  }>
}

export default function ReportsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [homework, setHomework] = useState<Homework[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomData, homeworkData, studentsData] = await Promise.all([
          api.getClassroom(params.id as string),
          api.getHomeworkByClassroom(params.id as string),
          api.getStudents(),
        ])

        setClassroom(classroomData)
        setHomework(homeworkData)
        setStudents(studentsData)

        // Calculate student progress
        const progressData: StudentProgress[] = []

        for (const student of studentsData) {
          const studentResults = await api.getStudentAllQuizResults(student.id)

          let totalQuizzes = 0
          let completedQuizzes = 0
          let totalScore = 0
          let completedHomework = 0

          const homeworkResults = []

          for (const hw of homeworkData) {
            let hwCompleted = true
            let hwScore = 0
            let hwQuizCount = 0

            for (const quiz of hw.quizzes) {
              totalQuizzes++
              hwQuizCount++

              const result = studentResults[quiz.id]
              if (result?.completed) {
                completedQuizzes++
                hwScore += result.score
              } else {
                hwCompleted = false
              }
            }

            if (hwCompleted && hwQuizCount > 0) {
              completedHomework++
              hwScore = Math.round(hwScore / hwQuizCount)
              totalScore += hwScore
            }

            homeworkResults.push({
              homeworkId: hw.id,
              homeworkName: hw.name,
              completed: hwCompleted,
              score: hwCompleted ? hwScore : 0,
            })
          }

          progressData.push({
            student,
            completedQuizzes,
            totalQuizzes,
            averageScore: completedHomework > 0 ? Math.round(totalScore / completedHomework) : 0,
            homeworkResults,
          })
        }

        setStudentProgress(progressData)
      } catch (error) {
        console.error("Error fetching reports data:", error)
        toast({
          title: "Error",
          description: "Failed to load reports data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const getClassStats = () => {
    if (studentProgress.length === 0) return { avgScore: 0, completionRate: 0 }

    const totalScore = studentProgress.reduce((sum, sp) => sum + sp.averageScore, 0)
    const avgScore = Math.round(totalScore / studentProgress.length)

    const totalPossibleQuizzes = studentProgress.reduce((sum, sp) => sum + sp.totalQuizzes, 0)
    const totalCompletedQuizzes = studentProgress.reduce((sum, sp) => sum + sp.completedQuizzes, 0)
    const completionRate =
      totalPossibleQuizzes > 0 ? Math.round((totalCompletedQuizzes / totalPossibleQuizzes) * 100) : 0

    return { avgScore, completionRate }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!classroom) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Classroom Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Layout>
    )
  }

  const classStats = getClassStats()

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classroom
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>
            <p className="text-gray-600 mt-2">
              {classroom.name} ({classroom.code})
            </p>
          </div>
        </div>

        {/* Class Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentProgress.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Average</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.avgScore}%</div>
              <p className="text-xs text-muted-foreground">Average score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">Quiz completion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Homework</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homework.length}</div>
              <p className="text-xs text-muted-foreground">Assignments</p>
            </CardContent>
          </Card>
        </div>

        {/* Student Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Individual student performance and completion status</CardDescription>
          </CardHeader>
          <CardContent>
            {studentProgress.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No student data available</p>
                <p className="text-sm text-gray-500 mt-2">Students need to be enrolled and complete assignments</p>
              </div>
            ) : (
              <div className="space-y-6">
                {studentProgress.map((progress) => (
                  <div key={progress.student.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          {progress.student.firstName} {progress.student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{progress.student.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{progress.averageScore}%</div>
                        <p className="text-sm text-gray-600">Average Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quiz Completion</span>
                          <span>
                            {progress.completedQuizzes}/{progress.totalQuizzes}
                          </span>
                        </div>
                        <Progress
                          value={
                            progress.totalQuizzes > 0 ? (progress.completedQuizzes / progress.totalQuizzes) * 100 : 0
                          }
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Performance</span>
                          <span>{progress.averageScore}%</span>
                        </div>
                        <Progress value={progress.averageScore} className="h-2" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Homework Results:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {progress.homeworkResults.map((hw) => (
                          <div key={hw.homeworkId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{hw.homeworkName}</span>
                            {hw.completed ? (
                              <Badge variant="default">{hw.score}%</Badge>
                            ) : (
                              <Badge variant="secondary">Incomplete</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
