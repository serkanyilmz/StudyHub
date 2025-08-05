"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  text: string
  isCorrect: boolean
}

export default function NewQuestionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [text, setText] = useState("")
  const [options, setOptions] = useState<Option[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ])
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAISuggestion, setLoadingAISuggestion] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await api.getTopics()
        setTopics(topicsData)
      } catch (error) {
        console.error("Error fetching topics:", error)
        toast({
          title: "Error",
          description: "Failed to load topics",
          variant: "destructive"
        })
      }
    }

    fetchTopics()
  }, [toast])

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
    if (!user?.id) return

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

    setLoading(true)

    try {
      await api.createQuestion({
        text: text.trim(),
        options: validOptions,
        topicId: selectedTopicId,
        writerId: user.id
      })

      toast({
        title: "Success",
        description: "Question created successfully!"
      })

      router.push("/writer/dashboard")
    } catch (error) {
      console.error("Error creating question:", error)
      setError("Failed to create question. Please try again.")
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

      const options = sample.options.map((opt) => ({
        text: opt.text,
        isCorrect: opt.correct
      }))

      setText(sample.text)

      setOptions(options)

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Question</CardTitle>
            <CardDescription>Add a new question to the question bank</CardDescription>
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
                  disabled={loading}
                />
              </div>

              {/* Topic Selection */}
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select
                  value={selectedTopicId}
                  onValueChange={setSelectedTopicId}
                  disabled={loading}
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
                    disabled={loading}
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
                          disabled={loading}
                        />
                        <Label className="text-sm">Correct</Label>
                      </div>
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(index, "text", e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        disabled={loading}
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          disabled={loading}
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
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
