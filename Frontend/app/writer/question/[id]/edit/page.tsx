"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Topic {
  id: string
  name: string
  parentTopic?: {
    id: string
    name: string
  }
}

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  options: Option[]
  topicId?: string
  topicName?: string
  writerId?: string
  writerName?: string
  // Legacy support
  topic?: {
    id: string
    name: string
  }
  writer?: {
    id: string
  }
}

interface OptionUpdate {
  text: string
  isCorrect: boolean
}

export default function EditQuestionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [question, setQuestion] = useState<Question | null>(null)
  const [text, setText] = useState("")
  const [options, setOptions] = useState<OptionUpdate[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [loadingAISuggestion, setLoadingAISuggestion] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id || !user?.id) return

      console.log("Fetching question with ID:", params.id)
      console.log("User ID:", user.id)

      try {
        console.log("About to call API for question:", params.id)
        const [questionData, topicsData] = await Promise.all([
          api.getQuestion(params.id as string),
          api.getTopics(),
        ])
        console.log("Successfully fetched question:", questionData)
        console.log("Question writer:", questionData.writer)
        console.log("Question writer id:", questionData?.writer?.id)

        // Check if user owns this question (try both new and legacy format)
        const questionWriterId = questionData?.writerId || questionData?.writer?.id
        if (questionWriterId && questionWriterId !== user.id) {
          toast({
            title: "Access Denied",
            description: "You can only edit your own questions",
            variant: "destructive",
          })
          router.push("/writer/questions")
          return
        }

        setQuestion(questionData)
        setText(questionData.text)
        
        // Set topic if available (try both new and legacy format)
        const topicId = questionData.topicId || questionData.topic?.id
        if (topicId) {
          setSelectedTopicId(topicId)
        }
        
        setTopics(topicsData)

        // Convert options to update format
        const optionsUpdate = questionData.options.map((opt: Option) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
        }))
        setOptions(optionsUpdate)
      } catch (error) {
        console.error("Error fetching question data:", error)
        toast({
          title: "Error",
          description: "Failed to load question data. The question may not exist or you don't have permission to access it.",
          variant: "destructive",
        })
        router.push("/writer/questions")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, user?.id, toast, router])

  const handleOptionChange = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const newOptions = [...options]

    if (field === "isCorrect" && value === true) {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index
      })
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value }
    }
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !question) return

    setError("")

    if (!text.trim()) {
      setError("Question text is required")
      return
    }

    if (!selectedTopicId) {
      setError("Please select a topic")
      return
    }

    const validOptions = options.filter((opt) => opt.text.trim())
    if (validOptions.length < 2) {
      setError("At least 2 options are required")
      return
    }

    const correctOptions = validOptions.filter((opt) => opt.isCorrect)
    if (correctOptions.length === 0) {
      setError("Exactly one option must be marked as correct")
      return
    }

    if (correctOptions.length > 1) {
      setError("Only one option can be marked as correct")
      return
    }

    setUpdating(true)

    try {
      await api.updateQuestion(question.id, {
        text: text.trim(),
        options: validOptions,
        topicId: selectedTopicId,
        writerId: user.id
      })

      toast({
        title: "Success",
        description: "Question updated successfully!"
      })

      router.push("/writer/questions")
    } catch (error) {
      console.error("Error updating question:", error)
      setError("Failed to update question. Please try again.")
    } finally {
      setUpdating(false)
    }
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

  const getTopicDisplayName = (topic: Topic) => {
    if (topic.parentTopic) {
      return `${topic.parentTopic.name} > ${topic.name}`
    }
    return topic.name
  }

  const handleAISuggestion = async () => {
    if (!selectedTopicId) {
      toast({
        title: "Select Topic",
        description: "Please select a topic before requesting AI suggestion",
      })
      return
    }

    setLoadingAISuggestion(true)
    setError("")

    try {
      const sample = await api.getSampleQuestion(selectedTopicId)

      const optionsUpdate = sample.options.map((opt: any) => ({
        text: opt.text,
        isCorrect: opt.correct
      }))

      setText(sample.text)
      setOptions(optionsUpdate)

      toast({
        title: "AI Suggestion Applied",
        description: "Sample question and options have been filled in."
      })
    } catch (err) {
      console.error("Failed to fetch AI suggestion:", err)
      toast({
        title: "Error",
        description: "Failed to get AI-generated question",
        variant: "destructive"
      })
    } finally {
      setLoadingAISuggestion(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading question...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!question) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h1>
          <p className="text-gray-600 mb-8">The question you're looking for doesn't exist or you don't have permission to edit it.</p>
          <Button onClick={() => router.push("/writer/questions")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
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
            <CardTitle>Edit Question</CardTitle>
            <CardDescription>Update your question details and options</CardDescription>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAISuggestion}
                disabled={loadingAISuggestion}
                className="ai-enhanced flex items-center"
              >
                <span className={loadingAISuggestion ? "mr-2 animate-pulse" : "mr-2"}>
                  <Image
                    src="/gemini-logo.svg"
                    alt="Gemini Logo"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </span>
                {loadingAISuggestion ? "Getting AI suggestion..." : "Get AI Suggestion"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <Label htmlFor="text">Question Text</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your question here..."
                  rows={3}
                  required
                  disabled={updating}
                />
              </div>

              {/* Topic Selection */}
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select
                  value={selectedTopicId}
                  onValueChange={setSelectedTopicId}
                  disabled={updating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {getParentTopics().flatMap(topic => renderTopicOptionsRecursively(topic, 0))}
                  </SelectContent>
                </Select>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Answer Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={updating}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={option.isCorrect}
                          onCheckedChange={(checked) =>
                            handleOptionChange(index, "isCorrect", checked as boolean)
                          }
                          disabled={updating}
                        />
                        <Label className="text-sm">Correct</Label>
                      </div>
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, "text", e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        disabled={updating}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          disabled={updating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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
                  disabled={updating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updating} className="flex-1">
                  {updating ? "Updating..." : "Update Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
