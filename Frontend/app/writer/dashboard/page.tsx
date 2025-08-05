"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { PenTool, FileText, Layers, Plus, Brain } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useGeminiAnimation } from "@/components/GeminiAnimation"
import Image from "next/image"

interface Question {
  id: string
  text: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  writer: {
    id: string
  }
  topic?: {
    id: string
    name: string
  }
  topicId?: string
  topicName?: string
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
  questions: Array<{
    question: Question
    questionNo: number
  }>
}

interface Topic {
  id: string
  name: string
  parentTopic?: {
    id: string
    name: string
  }
}

export default function WriterDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [questions, setQuestions] = useState<Question[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      try {
        const [questionsData, quizzesData, topicsData] = await Promise.all([
          api.getQuestions().catch(() => []),
          api.getQuizzes().catch(() => []),
          api.getTopics().catch(() => []),
        ])

        // Filter questions created by current writer
        const writerQuestions = questionsData.filter(
          (question: Question) => question.writer && question.writer.id === user.id,
        )
        setQuestions(writerQuestions)

        // Filter quizzes created by current writer
        const writerQuizzes = quizzesData.filter((quiz: Quiz) => quiz.writer && quiz.writer.id === user.id)
        setQuizzes(writerQuizzes)
        setTopics(topicsData)
      } catch (error) {
        console.error("Error fetching writer data:", error)
        
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const getRecentQuestions = () => {
    return questions.slice(0, 3)
  }

  const getRecentQuizzes = () => {
    return quizzes.slice(0, 3)
  }

  const handleAIAction = (action: string) => {
    toast({
      title: "AI Assistant",
      description: `${action} feature coming soon!`,
    })
  }

 

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "hsl(var(--studyhub-dark-grey))" }}>
              Writer Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Create and manage educational content</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/writer/question/new">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Question
              </Button>
            </Link>
            <Link href="/writer/quiz/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Quiz
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="writer-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions</CardTitle>
              <FileText className="h-4 w-4 writer-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold writer-accent">{questions.length}</div>
              <p className="text-xs text-muted-foreground">Total created</p>
            </CardContent>
          </Card>

          <Card className="writer-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
              <PenTool className="h-4 w-4 writer-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold writer-accent">{quizzes.length}</div>
              <p className="text-xs text-muted-foreground">Published quizzes</p>
            </CardContent>
          </Card>

          <Card className="writer-bg border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topics</CardTitle>
              <Layers className="h-4 w-4 writer-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold writer-accent">{topics.length}</div>
              <p className="text-xs text-muted-foreground">Available topics</p>
            </CardContent>
          </Card>

          <Card className="ai-enhanced border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Assistance</CardTitle>
              <Image src="/gemini-logo.svg" alt="Gemini" width={20} height={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Active</div>
              <p className="text-xs text-muted-foreground">Content suggestions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Questions */}
          <Card className="connection-line border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Questions</CardTitle>
                  <CardDescription>Your latest created questions</CardDescription>
                </div>
                <Link href="/writer/questions">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {getRecentQuestions().length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No questions yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first question to get started</p>
                  <Link href="/writer/question/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Question
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRecentQuestions().map((question) => (
                    <div key={question.id} className="p-4 border rounded-lg connection-line">
                      <p className="font-medium text-sm mb-2 line-clamp-2">{question.text}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{question.options.length} options</Badge>
                        <Link href={`/writer/question/${question.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quizzes */}
          <Card className="connection-line border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Quizzes</CardTitle>
                  <CardDescription>Your published quizzes</CardDescription>
                </div>
                <Link href="/writer/quizzes">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {getRecentQuizzes().length === 0 ? (
                <div className="text-center py-8">
                  <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No quizzes yet</p>
                  <p className="text-sm text-gray-500 mt-2">Create your first quiz from questions</p>
                  <Link href="/writer/quiz/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRecentQuizzes().map((quiz) => (
                    <div key={quiz.id} className="p-4 border rounded-lg connection-line">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{quiz.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Topic: {quiz.topic.name}</p>
                          <Badge variant="outline" className="mt-2">
                            {quiz.questions.length} questions
                          </Badge>
                        </div>
                        <Link href={`/writer/quiz/${quiz.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
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

        {/* AI Content Assistant */}
        <Card className="ai-enhanced border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image
                              src="/gemini-logo.svg" 
                              alt="Gemini Icon"
                              width={30}
                              height={30}
                              className="object-contain mr-2"
                            />
              AI Content Assistant
            </CardTitle>
            <CardDescription>Get AI-powered suggestions for creating better educational content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/writer/question/new">
                <div className="p-4 border rounded-lg text-center connection-line">
                  <h3 className="font-medium mb-2">Question Suggestions</h3>
                  <p className="text-sm text-gray-600 mb-4">Get AI-generated question ideas based on topics</p>
                  <div className="relative">
                    <Button variant="outline" size="sm">
                      Get Suggestions
                    </Button>
                  </div>
                </div>
              </Link>
              <div className="p-4 border rounded-lg text-center connection-line">
                <h3 className="font-medium mb-2">Content Quality Check</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze your questions for clarity and difficulty</p>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => handleAIAction("Content Quality Check")}>
                    Check Quality
                  </Button>
                  
                </div>
              </div>
              <div className="p-4 border rounded-lg text-center connection-line">
                <h3 className="font-medium mb-2">Topic Insights</h3>
                <p className="text-sm text-gray-600 mb-4">Discover trending topics and learning patterns</p>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => handleAIAction("Topic Insights")}>
                    View Insights
                  </Button>
                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="connection-line border-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for content writers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/writer/question/new">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer connection-line">
                  <FileText className="h-8 w-8 writer-accent mx-auto mb-2" />
                  <h3 className="font-medium mb-1">New Question</h3>
                  <p className="text-sm text-gray-600">Create a new question</p>
                </div>
              </Link>
              <Link href="/writer/quiz/new">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer connection-line">
                  <PenTool className="h-8 w-8 writer-accent mx-auto mb-2" />
                  <h3 className="font-medium mb-1">New Quiz</h3>
                  <p className="text-sm text-gray-600">Compile questions into a quiz</p>
                </div>
              </Link>
              <Link href="/writer/topics">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer connection-line">
                  <Layers className="h-8 w-8 writer-accent mx-auto mb-2" />
                  <h3 className="font-medium mb-1">Manage Topics</h3>
                  <p className="text-sm text-gray-600">Organize content topics</p>
                </div>
              </Link>
              <Link href="/writer/question/new">
                <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer connection-line" onClick={() => handleAIAction("More AI Assistant")}>
                  <Image
                    src="/gemini-logo.svg" 
                    alt="Gemini Icon"
                    width={30}
                    height={30}
                    className="object-contain  mx-auto mb-2"
                  />
                  <h3 className="font-medium mb-1">AI Assistant</h3>
                  <p className="text-sm text-gray-600">Get content suggestions</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
