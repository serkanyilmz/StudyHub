import type { UserRole } from "@/shared/types/user"

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
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

export const getRoleDisplayName = (role: UserRole): string => {
  return role.charAt(0).toUpperCase() + role.slice(1)
}
