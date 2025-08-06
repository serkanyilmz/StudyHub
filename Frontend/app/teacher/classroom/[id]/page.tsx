"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users, Calendar, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
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

interface Homework {
  id: string
  name: string
  deadline: string
  quizzes: Array<{
    id: string
    name: string
  }>
}

interface Quiz {
  id: string
  name: string
  topic: {
    name: string
  }
}

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
}

export default function TeacherClassroomPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [homework, setHomework] = useState<Homework[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [assignFormData, setAssignFormData] = useState({
    name: "",
    selectedQuizzes: [] as string[],
    deadline: "",
  })
  const [assignLoading, setAssignLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classroomData, homeworkData, quizzesData, allStudents] = await Promise.all([
          api.getClassroom(params.id as string),
          api.getHomeworkByClassroom(params.id as string),
          api.getQuizzes(),
          api.getEnrolledStudents(params.id as string),
        ])

        setClassroom(classroomData)
        setHomework(homeworkData)
        setQuizzes(quizzesData)
        setStudents(allStudents.slice(0, 10)) 
        
      } catch (error) {
        console.error("Error fetching classroom data:", error)
        toast({
          title: "Error",
          description: "Failed to load classroom data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, toast])

  const handleAssignHomework = async (e: React.FormEvent) => {
    e.preventDefault()
    setAssignLoading(true)

    try {
      const deadlineISO = new Date(assignFormData.deadline).toISOString()

      await api.createHomework({
        name: assignFormData.name,
        quizIdList: assignFormData.selectedQuizzes,
        classroomId: params.id as string,
        deadline: deadlineISO,
      })

      toast({
        title: "Success",
        description: "Homework assigned successfully!",
      })

      setShowAssignForm(false)
      setAssignFormData({ name: "", selectedQuizzes: [], deadline: "" })

      // Refresh homework list
      const homeworkData = await api.getHomeworkByClassroom(params.id as string)
      setHomework(homeworkData)
    } catch (error) {
      console.error("Error assigning homework:", error)
      toast({
        title: "Error",
        description: "Failed to assign homework",
        variant: "destructive",
      })
    } finally {
      setAssignLoading(false)
    }
  }

  const handleQuizToggle = (quizId: string, checked: boolean) => {
    if (checked) {
      setAssignFormData((prev) => ({
        ...prev,
        selectedQuizzes: [...prev.selectedQuizzes, quizId],
      }))
    } else {
      setAssignFormData((prev) => ({
        ...prev,
        selectedQuizzes: prev.selectedQuizzes.filter((id) => id !== quizId),
      }))
    }
  }

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading classroom...</p>
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
            <p className="text-gray-600 mt-2">Classroom Code: {classroom.code}</p>
            <p className="text-sm text-gray-500">Total Students: {students.length}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAssignForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Homework
            </Button>
            <Link href={`/teacher/reports/${classroom.id}`}>
              <Button variant="outline">View Reports</Button>
            </Link>
          </div>
        </div>

        {/* Assign Homework Form */}
        {showAssignForm && (
          <Card>
            <CardHeader>
              <CardTitle>Assign New Homework</CardTitle>
              <CardDescription>Create a homework assignment for this classroom</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignHomework} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Homework Name</Label>
                  <Input
                    id="name"
                    value={assignFormData.name}
                    onChange={(e) => setAssignFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter homework name..."
                    required
                    disabled={assignLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={assignFormData.deadline}
                    onChange={(e) => setAssignFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                    required
                    disabled={assignLoading}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Select Quizzes ({assignFormData.selectedQuizzes.length} selected)</Label>
                  <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
                    {quizzes.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No quizzes available</p>
                    ) : (
                      quizzes.map((quiz) => (
                        <div key={quiz.id} className="flex items-center space-x-3 p-2 border rounded">
                          <input
                            type="checkbox"
                            checked={assignFormData.selectedQuizzes.includes(quiz.id)}
                            onChange={(e) => handleQuizToggle(quiz.id, e.target.checked)}
                            disabled={assignLoading}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{quiz.name}</p>
                            <p className="text-sm text-gray-600">Topic: {quiz.topic.name}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAssignForm(false)}
                    disabled={assignLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={assignLoading || assignFormData.selectedQuizzes.length === 0}
                    className="flex-1"
                  >
                    {assignLoading ? "Assigning..." : "Assign Homework"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Homework</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homework.length}</div>
              <p className="text-xs text-muted-foreground">Assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {homework.filter((hw) => new Date(hw.deadline) > new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground">Due soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Quizzes</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground">Ready to assign</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrolled Students */}
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Students in this classroom</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No students enrolled yet</p>
                  <p className="text-sm text-gray-500 mt-2">Share the class code with students to join</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <Badge variant="outline" className="text-[hsl(var(--studyhub-student-green))] border-[hsl(var(--studyhub-student-green)/0.6)] bg-[hsl(var(--studyhub-student-green)/0.05)] hover:bg-[hsl(var(--studyhub-student-green)/0.2)] transition-colors" >Student</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Homework List */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Homework</CardTitle>
              <CardDescription>All homework assignments for this classroom</CardDescription>
            </CardHeader>
            <CardContent>
              {homework.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No homework assigned yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first homework assignment</p>
                  <Button className="mt-4" onClick={() => setShowAssignForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Homework
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {homework.map((hw) => (
                    <div key={hw.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{hw.name}</h3>
                        <p className="text-sm text-gray-600">
                          {hw.quizzes.length} quiz{hw.quizzes.length !== 1 ? "es" : ""}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          Due: {formatDeadline(hw.deadline)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/teacher/homework/${hw.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
