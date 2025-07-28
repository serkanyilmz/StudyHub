export type UserRole = "admin" | "writer" | "teacher" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthFormProps {
  onLogin: (user: User) => void
}
