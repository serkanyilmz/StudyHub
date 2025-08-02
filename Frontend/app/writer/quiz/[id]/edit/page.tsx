"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Topic {
  id: string
  name: string
  parentTopic?: {
    id: string
    name: string
  }
}

interface Question {
  id: string
  text: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  topic: {
    id: string
    name: string
  }
  writer: {
    id: string
  }
}

interface Quiz {
  id: string
  name: string
  topic: {
    id: string
    name: string
  }
  writer: {
    id: string
  }
  quizQuestions: Array<{
    id: string
    questionNo: number
    question: {
      id: string
      text: string
    }
  }>
}

interface SelectedQuestion {
  questionId: string
  questionNo: number
}

export default function EditQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [name, setName] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id || !user?.id) return

      try {
        const [quizData, topicsData, questionsData] = await Promise.all([
          api.getQuiz(params.id as string),
          api.getTopics(),
          api.getQuestions(),
        ])

        setQuiz(quizData)
        setName(quizData.name)
        setSelectedTopicId(quizData.topic.id)
        setTopics(topicsData)

        // Filter questions by current writer
        const writerQuestions = questionsData.filter((q: Question) => q.writer && q.writer.id === user.id)
        setQuestions(writerQuestions)

        // Set selected questions from quiz
        const quizQuestions = quizData.questions.map((qq: any) => ({
          questionId: qq.question.id,
          questionNo: qq.questionNo,
        }))
        setSelectedQuestions(quizQuestions)
      } catch (error) {
        console.error("Error fetching quiz data:", error)
        toast({
          title: "Error",
          description: "Failed to load quiz data",
          variant: "destructive",
        })
        router.push("/writer/quizzes")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, user?.id, toast, router])

  const getQuestionsForTopic = () => {
    if (!selectedTopicId) return []
    return questions.filter((q) => q.topic.id === selectedTopicId)
  }

  const handleQuestionToggle = (questionId: string, checked: boolean) => {
    if (checked) {
      const questionNo = selectedQuestions.length + 1
      setSelectedQuestions([...selectedQuestions, { questionId, questionNo }])
    } else {
      const filtered = selectedQuestions.filter((q) => q.questionId !== questionId)
      // Renumber questions
      const renumbered = filtered.map((q, index) => ({ ...q, questionNo: index + 1 }))
      setSelectedQuestions(renumbered)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !quiz) return

    setError("")

    if (!name.trim()) {
      setError("Quiz name is required")
      return
    }

    if (!selectedTopicId) {
      setError("Please select a topic")
      return
    }

    if (selectedQuestions.length === 0) {
      setError("Please select at least one question")
      return
    }

    setUpdating(true)

    try {
      await api.updateQuiz(quiz.id, {
        name: name.trim(),
        quizQuestionCommandList: selectedQuestions,
        topicId: selectedTopicId,
        writerId: user.id,
      })

      toast({
        title: "Success",
        description: "Quiz updated successfully!",
      })

      router.push("/writer/quizzes")
    } catch (error) {
      console.error("Error updating quiz:", error)
      setError("Failed to update quiz. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const getTopicDisplayName = (topic: Topic) => {
    if (topic.parentTopic) {
      return `${topic.parentTopic.name} > ${topic.name}`
    }
    return topic.name
  }

  const isQuestionSelected = (questionId: string) => {
    return selectedQuestions.some((q) => q.questionId === questionId)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Quiz not found</p>
          <Button onClick={() => router.push("/writer/quizzes")} className="mt-4">
            Back to Quizzes
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push("/writer/quizzes")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quizzes
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Quiz</CardTitle>
            <CardDescription>Update your quiz details and questions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Quiz Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter quiz name..."
                  required
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={selectedTopicId} onValueChange={setSelectedTopicId} disabled={updating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {getTopicDisplayName(topic)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTopicId && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Select Questions ({selectedQuestions.length} selected)</Label>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4">
                    {getQuestionsForTopic().length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No questions available for this topic. Create some questions first.
                      </p>
                    ) : (
                      getQuestionsForTopic().map((question) => (
                        <div key={question.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            checked={isQuestionSelected(question.id)}
                            onCheckedChange={(checked) => handleQuestionToggle(question.id, checked as boolean)}
                            disabled={updating}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{question.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{question.options.length} options</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/writer/quizzes")}
                  disabled={updating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updating} className="flex-1">
                  {updating ? "Updating..." : "Update Quiz"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
