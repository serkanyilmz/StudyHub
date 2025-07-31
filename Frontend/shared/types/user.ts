export type UserRole = "admin" | "writer" | "teacher" | "student"

export interface User {
  id: string
  username: string
  role: UserRole
}

export interface AuthFormProps {
  onLogin: (user: User) => void
}
