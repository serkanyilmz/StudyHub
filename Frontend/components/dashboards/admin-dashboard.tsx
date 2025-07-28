"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, FileText, CheckCircle, XCircle } from "lucide-react"

interface AdminDashboardProps {
  activeView: string
}

export function AdminDashboard({ activeView }: AdminDashboardProps) {
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, color: "text-blue-600" },
    { title: "Pending Applications", value: "23", icon: FileText, color: "text-orange-600" },
    { title: "Active Writers", value: "89", icon: CheckCircle, color: "text-green-600" },
    { title: "Active Teachers", value: "156", icon: CheckCircle, color: "text-purple-600" },
  ]

  const applications = [
    { id: 1, name: "John Smith", email: "john@example.com", role: "writer", status: "pending", date: "2024-01-15" },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "teacher",
      status: "pending",
      date: "2024-01-14",
    },
    { id: 3, name: "Mike Wilson", email: "mike@example.com", role: "writer", status: "approved", date: "2024-01-13" },
  ]

  const users = [
    {
      id: 1,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "student",
      status: "active",
      joinDate: "2024-01-10",
    },
    { id: 2, name: "Bob Davis", email: "bob@example.com", role: "teacher", status: "active", joinDate: "2024-01-08" },
    {
      id: 3,
      name: "Carol White",
      email: "carol@example.com",
      role: "writer",
      status: "inactive",
      joinDate: "2024-01-05",
    },
  ]

  if (activeView === "dashboard") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and monitor platform activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Writer and Teacher applications awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-gray-600">{app.role} application</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                      {app.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Key metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Active Users</span>
                  <span className="font-medium">892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Questions Created Today</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quizzes Completed</span>
                  <span className="font-medium">234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Requests</span>
                  <span className="font-medium">1,567</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (activeView === "applications") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-600">Review and manage Writer and Teacher applications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Applications awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.role}</Badge>
                    </TableCell>
                    <TableCell>{app.date}</TableCell>
                    <TableCell>
                      <Badge variant={app.status === "pending" ? "secondary" : "default"}>{app.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeView === "users") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">View and manage all platform users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Registered users across all roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <div>Select a view from the sidebar</div>
}
