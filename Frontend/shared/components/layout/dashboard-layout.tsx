"use client"

import { useState } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  Brain,
  PlusCircle,
  BarChart3,
  Calendar,
} from "lucide-react"
import { AdminDashboard } from "@/features/admin/pages/admin-dashboard"
import { WriterDashboard } from "@/features/writer/pages/writer-dashboard"
import { TeacherDashboard } from "@/features/teacher/pages/teacher-dashboard"
import { StudentDashboard } from "@/features/student/pages/student-dashboard"
import type { User } from "@/shared/types/user"
import type { MenuItem } from "@/shared/types/common"

interface DashboardLayoutProps {
  user: User
  onLogout: () => void
}

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState("dashboard")

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }]

    switch (user.role) {
      case "admin":
        return [
          ...baseItems,
          { id: "users", label: "Users", icon: Users },
          { id: "applications", label: "Applications", icon: FileText },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
        ]
      case "writer":
        return [
          ...baseItems,
          { id: "questions", label: "Questions", icon: FileText },
          { id: "quizzes", label: "Quizzes", icon: BookOpen },
          { id: "ai-assistant", label: "AI Assistant", icon: Brain },
          { id: "bulk-import", label: "Bulk Import", icon: PlusCircle },
        ]
      case "teacher":
        return [
          ...baseItems,
          { id: "classes", label: "Classes", icon: GraduationCap },
          { id: "assignments", label: "Assignments", icon: Calendar },
          { id: "performance", label: "Performance", icon: BarChart3 },
        ]
      case "student":
        return [
          ...baseItems,
          { id: "classes", label: "My Classes", icon: GraduationCap },
          { id: "quizzes", label: "Quizzes", icon: BookOpen },
          { id: "progress", label: "Progress", icon: BarChart3 },
        ]
      default:
        return baseItems
    }
  }

  const getRoleColor = (): string => {
    switch (user.role) {
      case "admin":
        return "bg-red-500"
      case "writer":
        return "bg-blue-500"
      case "teacher":
        return "bg-green-500"
      case "student":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderContent = () => {
    const props = { activeView }

    switch (user.role) {
      case "admin":
        return <AdminDashboard {...props} />
      case "writer":
        return <WriterDashboard {...props} />
      case "teacher":
        return <TeacherDashboard {...props} />
      case "student":
        return <StudentDashboard {...props} />
      default:
        return <div>Dashboard</div>
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">StudyHub</h2>
                <div className="flex items-center gap-1">
                  <Brain className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">Powered by Gemini</span>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <Badge className={`${getRoleColor()} text-white text-xs`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Welcome back, {user.name}</span>
            </div>
          </header>
          <main className="flex-1 p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
