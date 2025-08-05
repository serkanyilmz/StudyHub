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

interface ClassroomStats {
  averageScore: number
  completionRate: number
  totalStudents: number
  totalQuizzes: number
  completedQuizzes: number
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
  const [classroomStats, setClassroomStats] = useState<ClassroomStats | null>(null)
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

        // Fetch classroom stats from backend
        if (user?.id) {
          try {
            const stats = await api.getTeacherClassroomStats(user.id, params.id as string)
            setClassroomStats(stats)
          } catch (error) {
            console.error("Error fetching classroom stats:", error)
          }
        }

        // Calculate student progress for students in this classroom
        let classroomStudents = studentsData
        
        // If classroom has students property, filter by it
        if (classroomData.students && Array.isArray(classroomData.students)) {
          classroomStudents = studentsData.filter(student => 
            classroomData.students.some((cs: any) => cs.id === student.id)
          )
        }
        
        // If no students found with classroom filter, use all students for now
        if (classroomStudents.length === 0) {
          classroomStudents = studentsData
        }
        
        const progressData: StudentProgress[] = []

        for (const student of classroomStudents) {
          try {
            const studentResults = await api.getStudentAllQuizResults(student.id)

            let totalQuizzes = 0
            let completedQuizzes = 0
            let allScores: number[] = []
            let completedHomework = 0

            const homeworkResults = []

            for (const hw of homeworkData) {
              let hwCompleted = true
              let hwScores: number[] = []
              let hwQuizCount = 0

              for (const quiz of hw.quizzes) {
                totalQuizzes++
                hwQuizCount++

                const result = studentResults[quiz.id]
                if (result?.completed) {
                  completedQuizzes++
                  hwScores.push(result.score)
                  allScores.push(result.score)
                }
              }

              // Calculate homework score if at least one quiz is completed
              let hwScore = 0
              if (hwScores.length > 0) {
                // If all quizzes in homework are completed, mark as completed
                hwCompleted = hwScores.length === hw.quizzes.length
                hwScore = Math.round(hwScores.reduce((sum, score) => sum + score, 0) / hwScores.length)
                if (hwCompleted) {
                  completedHomework++
                }
              } else {
                hwCompleted = false
              }

              homeworkResults.push({
                homeworkId: hw.id,
                homeworkName: hw.name,
                completed: hwCompleted,
                score: hwScore,
              })
            }

            // Calculate overall average from homework scores that have at least one quiz completed
            const homeworkScoresWithData = homeworkResults
              .filter(hw => hw.score > 0) // Include homework with any completed quizzes
              .map(hw => hw.score)
            
            const averageScore = homeworkScoresWithData.length > 0 
              ? Math.round(homeworkScoresWithData.reduce((sum, score) => sum + score, 0) / homeworkScoresWithData.length)
              : (allScores.length > 0 ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : 0)

            progressData.push({
              student,
              completedQuizzes,
              totalQuizzes,
              averageScore,
              homeworkResults,
            })
          } catch (error) {
            console.error(`Error calculating progress for student ${student.id}:`, error)
            // Add student with default values if calculation fails
            progressData.push({
              student,
              completedQuizzes: 0,
              totalQuizzes: 0,
              averageScore: 0,
              homeworkResults: [],
            })
          }
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
    // Don't use backend stats, use frontend calculation for consistency
    // Backend calculation seems to be incorrect
    
    // Calculate class average from individual student averages for consistency
    if (studentProgress.length === 0) return { avgScore: 0, completionRate: 0 }

    // Calculate class average as the average of individual student averages
    const studentAverages = studentProgress
      .map(sp => sp.averageScore)
      .filter(score => score > 0) // Only include students with scores
    
    const avgScore = studentAverages.length > 0 
      ? Math.round(studentAverages.reduce((sum, score) => sum + score, 0) / studentAverages.length)
      : 0

    const totalPossible = studentProgress.reduce((sum, sp) => sum + sp.totalQuizzes, 0)
    const totalCompleted = studentProgress.reduce((sum, sp) => sum + sp.completedQuizzes, 0)
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

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
              <div className="text-2xl font-bold">{classroomStats?.totalStudents || studentProgress.length}</div>
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
