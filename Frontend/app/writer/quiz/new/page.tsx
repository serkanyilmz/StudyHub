"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

interface SelectedQuestion {
  questionId: string
  questionNo: number
}

export default function NewQuizPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch topics first
        const topicsData = await api.getTopics()
        setTopics(topicsData)

        // Fetch all questions
        const questionsData = await api.getQuestions()

        // Filter questions by current writer
        const writerQuestions = questionsData.filter((q: Question) => q.writer && q.writer.id === user?.id)
        setQuestions(writerQuestions)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load topics and questions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user?.id, toast])

  const getQuestionsForTopic = () => {
    if (!selectedTopicId) return []
    
    // Get all descendant topic IDs (including the selected topic itself)
    const getAllDescendantTopicIds = (topicId: string): string[] => {
      const result = [topicId]
      const childTopics = topics.filter(t => t.parentTopic?.id === topicId)
      
      childTopics.forEach(childTopic => {
        result.push(...getAllDescendantTopicIds(childTopic.id))
      })
      
      return result
    }
    
    const allRelevantTopicIds = getAllDescendantTopicIds(selectedTopicId)
    
    return questions.filter((q) => allRelevantTopicIds.includes(q.topic.id))
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
    if (!user?.id) return

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

    setLoading(true)

    try {
      await api.createQuiz({
        name: name.trim(),
        quizQuestionCommandList: selectedQuestions,
        topicId: selectedTopicId,
        writerId: user.id,
      })

      toast({
        title: "Success",
        description: "Quiz created successfully!",
      })

      router.push("/writer/quizzes")
    } catch (error) {
      console.error("Error creating quiz:", error)
      setError("Failed to create quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getTopicDisplayName = (topic: Topic) => {
    if (topic.parentTopic) {
      return `${topic.parentTopic.name} > ${topic.name}`
    }
    return topic.name
  }

  // Get parent topics (root topics)
  const getParentTopics = () => {
    return topics.filter((topic) => !topic.parentTopic)
  }

  // Get child topics for a parent
  const getChildTopics = (parentId: string) => {
    return topics.filter((topic) => topic.parentTopic?.id === parentId)
  }

  // Recursive function to render all topics for selection
  const renderTopicOptionsRecursively = (topic: Topic, level: number = 0): JSX.Element[] => {
    const result: JSX.Element[] = []
    const indent = "  ".repeat(level) + (level > 0 ? "└─ " : "")
    
    // Add current topic to options
    result.push(
      <SelectItem key={topic.id} value={topic.id}>
        <div className="flex items-center space-x-2">
          {level === 0 ? (
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          )}
          <span style={{ marginLeft: `${level * 0.5}rem` }}>{indent}{topic.name}</span>
        </div>
      </SelectItem>
    )
    
    // Add all child topics recursively
    const childTopics = getChildTopics(topic.id)
    childTopics.forEach(childTopic => {
      result.push(...renderTopicOptionsRecursively(childTopic, level + 1))
    })
    
    return result
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
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Quiz</CardTitle>
            <CardDescription>Compile questions into a quiz</CardDescription>
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
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={selectedTopicId} onValueChange={setSelectedTopicId} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {getParentTopics().flatMap(topic => renderTopicOptionsRecursively(topic, 0))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTopicId && (
                  <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Select Questions ({selectedQuestions.length} selected)</Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Questions from selected topic and all its subtopics
                      </p>
                    </div>
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
                            disabled={loading}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{question.text}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-gray-500">{question.options.length} options</p>
                              <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {getTopicDisplayName(question.topic)}
                              </p>
                            </div>
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
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Quiz"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
