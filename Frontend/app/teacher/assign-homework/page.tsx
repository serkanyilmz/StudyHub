"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Calendar, BookOpen } from "lucide-react"
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

interface Quiz {
  id: string
  name: string
  topic: {
    name: string
  }
  questions: Array<{
    question: {
      id: string
      text: string
    }
    questionNo: number
  }>
}

export default function AssignHomeworkPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    selectedClassrooms: [] as string[],
    selectedQuizzes: [] as string[],
    deadline: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        const [classroomsData, quizzesData] = await Promise.all([api.getClassrooms(), api.getQuizzes()])

        // Filter classrooms for current teacher
        const teacherClassrooms = classroomsData.filter((classroom: Classroom) => classroom.teacher.id === user.id)
        setClassrooms(teacherClassrooms)
        setQuizzes(quizzesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id, toast])

  const handleClassroomToggle = (classroomId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        selectedClassrooms: [...prev.selectedClassrooms, classroomId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedClassrooms: prev.selectedClassrooms.filter((id) => id !== classroomId),
      }))
    }
  }

  const handleQuizToggle = (quizId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        selectedQuizzes: [...prev.selectedQuizzes, quizId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedQuizzes: prev.selectedQuizzes.filter((id) => id !== quizId),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      if (!formData.name.trim()) {
        setError("Homework name is required")
        return
      }

      if (formData.selectedClassrooms.length === 0) {
        setError("Please select at least one classroom")
        return
      }

      if (formData.selectedQuizzes.length === 0) {
        setError("Please select at least one quiz")
        return
      }

      if (!formData.deadline) {
        setError("Please set a deadline")
        return
      }

      const deadlineISO = new Date(formData.deadline).toISOString()

      // Create homework for each selected classroom
      const promises = formData.selectedClassrooms.map((classroomId) =>
        api.createHomework({
          name: formData.name.trim(),
          quizIdList: formData.selectedQuizzes,
          classroomId,
          deadline: deadlineISO,
        }),
      )

      await Promise.all(promises)

      toast({
        title: "Success",
        description: `Homework assigned to ${formData.selectedClassrooms.length} classroom${formData.selectedClassrooms.length !== 1 ? "s" : ""}!`,
      })

      router.push("/teacher/dashboard")
    } catch (error) {
      console.error("Error assigning homework:", error)
      setError("Failed to assign homework. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Assign Homework</h1>
            <p className="text-gray-600 mt-2">Create and assign homework to your classrooms</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Homework Details</CardTitle>
              <CardDescription>Basic information about the homework assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Homework Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter homework name..."
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                  required
                  disabled={submitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Select Classrooms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Select Classrooms ({formData.selectedClassrooms.length} selected)
              </CardTitle>
              <CardDescription>Choose which classrooms to assign this homework to</CardDescription>
            </CardHeader>
            <CardContent>
              {classrooms.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No classrooms available</p>
                  <p className="text-sm text-gray-500 mt-2">Create a classroom first to assign homework</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        checked={formData.selectedClassrooms.includes(classroom.id)}
                        onCheckedChange={(checked) => handleClassroomToggle(classroom.id, checked as boolean)}
                        disabled={submitting}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{classroom.name}</h3>
                        <p className="text-sm text-gray-600">Code: {classroom.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Select Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Select Quizzes ({formData.selectedQuizzes.length} selected)
              </CardTitle>
              <CardDescription>Choose which quizzes to include in this homework</CardDescription>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No quizzes available</p>
                  <p className="text-sm text-gray-500 mt-2">Writers need to create quizzes first</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                      <Checkbox
                        checked={formData.selectedQuizzes.includes(quiz.id)}
                        onCheckedChange={(checked) => handleQuizToggle(quiz.id, checked as boolean)}
                        disabled={submitting}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{quiz.name}</h3>
                        <p className="text-sm text-gray-600">Topic: {quiz.topic.name}</p>
                        <p className="text-sm text-gray-500">
                          {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || formData.selectedClassrooms.length === 0 || formData.selectedQuizzes.length === 0}
              className="flex-1"
            >
              {submitting ? "Assigning..." : "Assign Homework"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
