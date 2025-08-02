"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenTool, Plus, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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
    question: {
      id: string
      text: string
    }
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

export default function QuizzesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState("all")

  useEffect(() => {
    fetchData()
  }, [user?.id])

  const fetchData = async () => {
    if (!user?.id) return

    try {
      const [quizzesData, topicsData] = await Promise.all([api.getQuizzes(), api.getTopics()])

      // Filter quizzes by current writer
      const writerQuizzes = quizzesData.filter((quiz: Quiz) => quiz.writer && quiz.writer.id === user.id)
      setQuizzes(writerQuizzes)
      setTopics(topicsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return

    try {
      await api.deleteQuiz(quizId)
      toast({
        title: "Success",
        description: "Quiz deleted successfully!",
      })
      fetchData()
    } catch (error) {
      console.error("Error deleting quiz:", error)
      toast({
        title: "Error",
        description: "Failed to delete quiz",
        variant: "destructive",
      })
    }
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopicId === "all" || quiz.topic.id === selectedTopicId
    return matchesSearch && matchesTopic
  })

  const getTopicDisplayName = (topic: Topic) => {
    if (topic.parentTopic) {
      return `${topic.parentTopic.name} > ${topic.name}`
    }
    return topic.name
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quizzes...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
            <p className="text-gray-600 mt-2">Manage your quiz collection</p>
          </div>
          <Link href="/writer/quiz/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Quiz
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {getTopicDisplayName(topic)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quizzes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="h-5 w-5 mr-2" />
              Quizzes ({filteredQuizzes.length})
            </CardTitle>
            <CardDescription>Your created quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQuizzes.length === 0 ? (
              <div className="text-center py-8">
                <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {quizzes.length === 0 ? "No quizzes yet" : "No quizzes match your filters"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {quizzes.length === 0
                    ? "Create your first quiz to get started"
                    : "Try adjusting your search or filters"}
                </p>
                {quizzes.length === 0 && (
                  <Link href="/writer/quiz/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{quiz.name}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline">{quiz.topic.name}</Badge>
                          <Badge variant="secondary">{quiz.questions.length} questions</Badge>
                        </div>
                        <div className="space-y-1">
                          {quiz.questions.slice(0, 2).map((q, index) => (
                            <div key={q.question.id} className="text-sm text-gray-600">
                              {index + 1}. {q.question.text.substring(0, 80)}
                              {q.question.text.length > 80 ? "..." : ""}
                            </div>
                          ))}
                          {quiz.questions.length > 2 && (
                            <div className="text-sm text-gray-500">
                              ... and {quiz.questions.length - 2} more questions
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link href={`/writer/quiz/${quiz.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(quiz.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
