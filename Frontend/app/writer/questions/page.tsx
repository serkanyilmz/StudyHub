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
import { FileText, Plus, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

interface Topic {
  id: string
  name: string
  parentTopic?: {
    id: string
    name: string
  }
}

export default function QuestionsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Question[]>([])
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
      const [questionsData, topicsData] = await Promise.all([api.getQuestions(), api.getTopics()])

      // Filter questions by current writer
      const writerQuestions = questionsData.filter(
        (question: Question) => question.writer && question.writer.id === user.id,
      )
      setQuestions(writerQuestions)
      setTopics(topicsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      await api.deleteQuestion(questionId)
      toast({
        title: "Success",
        description: "Question deleted successfully!",
      })
      fetchData()
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        title: "Error",
        description: "Failed to delete question. It may be used in quizzes and cannot be deleted.",
        variant: "destructive",
      })
    }
  }

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = selectedTopicId === "all" || question.topic.id === selectedTopicId
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
            <p className="text-gray-600">Loading questions...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
            <p className="text-gray-600 mt-2">Manage your question bank</p>
          </div>
          <Link href="/writer/question/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Question
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
                    placeholder="Search questions..."
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

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Questions ({filteredQuestions.length})
            </CardTitle>
            <CardDescription>Your created questions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {questions.length === 0 ? "No questions yet" : "No questions match your filters"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {questions.length === 0
                    ? "Create your first question to get started"
                    : "Try adjusting your search or filters"}
                </p>
                {questions.length === 0 && (
                  <Link href="/writer/question/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Question
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.text}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="outline">{question.topic.name}</Badge>
                          <Badge variant="secondary">{question.options.length} options</Badge>
                          <Badge variant="default">
                            {question.options.filter((opt) => opt.isCorrect).length} correct
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {question.options.map((option, index) => (
                            <div key={option.id} className="text-sm flex items-center space-x-2">
                              <span
                                className={`w-2 h-2 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-gray-300"}`}
                              />
                              <span className={option.isCorrect ? "text-green-700 font-medium" : "text-gray-600"}>
                                {option.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link href={`/writer/question/${question.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
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
