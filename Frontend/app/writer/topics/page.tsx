"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Layers } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Topic {
  id: string
  name: string
  parentTopic?: {
    id: string
    name: string
  }
}

export default function TopicsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    parentTopicId: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      const topicsData = await api.getTopics()
      setTopics(topicsData)
    } catch (error) {
      console.error("Error fetching topics:", error)
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFormLoading(true)

    try {
      const data = {
        name: formData.name.trim(),
        parentTopicId: formData.parentTopicId || undefined,
      }

      if (editingTopic) {
        await api.updateTopic(editingTopic.id, data)
        toast({
          title: "Success",
          description: "Topic updated successfully!",
        })
      } else {
        await api.createTopic(data)
        toast({
          title: "Success",
          description: "Topic created successfully!",
        })
      }

      setFormData({ name: "", parentTopicId: "" })
      alert(formData)
      setShowCreateForm(false)
      setEditingTopic(null)
      fetchTopics()
    } catch (error) {
      console.error("Error saving topic:", error)
      setError("Failed to save topic. This topic may be in use by questions or quizzes and cannot be modified.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic)
    setFormData({
      name: topic.name,
      parentTopicId: topic.parentTopic?.id || "",
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (topicId: string) => {
    if (!confirm("Are you sure you want to delete this topic?")) return

    try {
      await api.deleteTopic(topicId)
      toast({
        title: "Success",
        description: "Topic deleted successfully!",
      })
      fetchTopics()
    } catch (error) {
      console.error("Error deleting topic:", error)
      toast({
        title: "Error",
        description: "Failed to delete topic. It may be in use by questions or quizzes.",
        variant: "destructive",
      })
    }
  }

  const getTopicDisplayName = (topic: Topic) => {
    if (topic.parentTopic) {
      return `${topic.parentTopic.name} > ${topic.name}`
    }
    return topic.name
  }

  const getParentTopics = () => {
    return topics.filter((topic) => !topic.parentTopic)
  }

  const getChildTopics = (parentId: string) => {
    return topics.filter((topic) => topic.parentTopic?.id === parentId)
  }

  // Get all topics except the one being edited (for parent selection)
  const getAvailableParentTopics = () => {
    return topics.filter((topic) => topic.id !== editingTopic?.id)
  }

  // Get topic with indentation for display
  const getTopicDisplayNameWithIndent = (topic: Topic) => {
    if (topic.parentTopic) {
      return `  └─ ${topic.name}`
    }
    return topic.name
  }

  // Recursive function to render all topics for parent selection
  const renderTopicOptionsRecursively = (topic: Topic, level: number = 0): JSX.Element[] => {
    const result: JSX.Element[] = []
    const indent = "  ".repeat(level) + (level > 0 ? "└─ " : "")
    
    // Add current topic to options (if not being edited)
    if (topic.id !== editingTopic?.id) {
      result.push(
        <SelectItem key={topic.id} value={topic.id}>
          <div className="flex items-center space-x-2">
            {level === 0 ? (
              <Layers className="h-4 w-4 text-purple-600" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            )}
            <span style={{ marginLeft: `${level * 0.5}rem` }}>{indent}{topic.name}</span>
          </div>
        </SelectItem>
      )
    }
    
    // Add all child topics recursively
    const childTopics = getChildTopics(topic.id)
    childTopics.forEach(childTopic => {
      result.push(...renderTopicOptionsRecursively(childTopic, level + 1))
    })
    
    return result
  }

  // Recursive component to render topics
  const renderTopicTree = (topic: Topic, level: number = 0) => {
    const childTopics = getChildTopics(topic.id)
    const isRoot = level === 0
    
    return (
      <div key={topic.id} className="space-y-2">
        {/* Topic item */}
        <div 
          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
            isRoot 
              ? 'border-2 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200' 
              : 'bg-white hover:bg-gray-50 ml-8'
          }`}
          style={{ marginLeft: `${level * 2}rem` }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isRoot ? (
                <>
                  <Layers className="h-5 w-5 text-purple-600" />
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                    Root Topic
                  </Badge>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Level {level + 1}
                  </Badge>
                </>
              )}
            </div>
            <span className={`font-medium ${isRoot ? 'text-lg text-purple-900 font-semibold' : ''}`}>
              {topic.name}
            </span>
            {childTopics.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {childTopics.length} subtopic{childTopics.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEdit(topic)} 
              className={isRoot ? "border-purple-300 text-purple-700 hover:bg-purple-100" : "border-blue-300 text-blue-700 hover:bg-blue-100"}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(topic.id)}
              className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Render child topics recursively */}
        {childTopics.map((childTopic) => renderTopicTree(childTopic, level + 1))}
      </div>
    )
  }

  const cancelForm = () => {
    setShowCreateForm(false)
    setEditingTopic(null)
    setFormData({ name: "", parentTopicId: "" })
    setError("")
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading topics...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Topics</h1>
            <p className="text-gray-600 mt-2">Organize your content in a hierarchical structure. Create root topics and subtopics to categorize your questions and quizzes.</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Topic
          </Button>
        </div>

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingTopic ? "Edit Topic" : "Create New Topic"}</CardTitle>
              <CardDescription>
                {editingTopic ? "Update topic information" : "Add a new topic to organize your content"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Topic Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter topic name..."
                    required
                    disabled={formLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Topic</Label>
                  <div className="text-sm text-gray-600 mb-2">
                    {formData.parentTopicId ? 
                      "This will be created as a subtopic under the selected parent." : 
                      "Leave empty to create a root topic, or select a parent to create a subtopic."
                    }
                  </div>
                  <Select
                    value={formData.parentTopicId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parentTopicId: value === "none" ? "" : value })
                    }
                    disabled={formLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent topic (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center space-x-2">
                          <Layers className="h-4 w-4 text-purple-600" />
                          <span>No parent (Create as Root Topic)</span>
                        </div>
                      </SelectItem>
                      {/* Show all topics hierarchically using recursive function */}
                      {getParentTopics().flatMap(topic => renderTopicOptionsRecursively(topic, 0))}
                    </SelectContent>
                  </Select>
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
                    onClick={cancelForm}
                    disabled={formLoading}
                    className="flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formLoading} className="flex-1">
                    {formLoading ? "Saving..." : editingTopic ? "Update Topic" : "Create Topic"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              All Topics ({topics.length})
            </CardTitle>
            <CardDescription>Manage your content organization</CardDescription>
          </CardHeader>
          <CardContent>
            {topics.length === 0 ? (
              <div className="text-center py-8">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No topics yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first topic to organize content. You can create root topics and then add subtopics under them.
                </p>
                <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Topic
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Render root topics and their children recursively */}
                {getParentTopics().map((topic) => renderTopicTree(topic, 0))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
