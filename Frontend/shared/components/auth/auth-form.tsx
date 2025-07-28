"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Brain, GraduationCap } from "lucide-react"
import type { AuthFormProps, UserRole } from "@/shared/types/user"

interface RoleOption {
  id: UserRole
  name: string
  color: string
  description: string
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")

  const handleLogin = (role: UserRole) => {
    onLogin({
      id: "1",
      name: "Demo User",
      email: "demo@studyhub.com",
      role,
    })
  }

  const roles: RoleOption[] = [
    { id: "admin", name: "Admin", color: "bg-red-500", description: "Manage users and applications" },
    { id: "writer", name: "Writer", color: "bg-blue-500", description: "Create questions and quizzes" },
    { id: "teacher", name: "Teacher", color: "bg-green-500", description: "Manage classes and assignments" },
    { id: "student", name: "Student", color: "bg-purple-500", description: "Join classes and take quizzes" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">StudyHub</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Brain className="h-4 w-4 text-gray-600" />
            <p className="text-gray-600">Powered by Gemini AI</p>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Welcome to StudyHub</CardTitle>
            <CardDescription>Sign in to access your personalized dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>

                <div className="space-y-3">
                  <Label>Demo Login (Select Role)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <Button
                        key={role.id}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-center gap-2 bg-transparent"
                        onClick={() => handleLogin(role.id)}
                      >
                        <Badge className={`${role.color} text-white`}>{role.name}</Badge>
                        <span className="text-xs text-gray-600 text-center">{role.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input id="email-register" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input id="password-register" type="password" placeholder="Create a password" />
                </div>

                <div className="space-y-3">
                  <Label>Select Your Role</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {roles.slice(1).map((role) => (
                      <Button
                        key={role.id}
                        variant={selectedRole === role.id ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <Badge className={`${role.color} text-white mr-2`}>{role.name}</Badge>
                        {role.description}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => handleLogin(selectedRole)}>
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
