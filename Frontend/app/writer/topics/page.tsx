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
      setShowCreateForm(false)
      setEditingTopic(null)
      fetchTopics()
    } catch (error) {
      console.error("Error saving topic:", error)
      setError("Failed to save topic. Please try again.")
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
            <p className="text-gray-600 mt-2">Organize your content topics</p>
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
                  <Label htmlFor="parent">Parent Topic (Optional)</Label>
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
                      <SelectItem value="none">No parent (Root topic)</SelectItem>
                      {getParentTopics()
                        .filter((topic) => topic.id !== editingTopic?.id)
                        .map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
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
                <p className="text-gray-600">No topics yet</p>
                <p className="text-sm text-gray-500 mt-2">Create your first topic to organize content</p>
                <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Topic
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Root topics */}
                {getParentTopics().map((topic) => (
                  <div key={topic.id} className="space-y-2">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">Root</Badge>
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(topic)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(topic.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Child topics */}
                    {getChildTopics(topic.id).map((childTopic) => (
                      <div key={childTopic.id} className="flex items-center justify-between p-4 border rounded-lg ml-8">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">Child</Badge>
                          <span>{childTopic.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(childTopic)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(childTopic.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
