import type { BaseEntity, Status } from "@/shared/types/common"
import type { UserRole } from "@/shared/types/user"

export interface Application extends BaseEntity {
  name: string
  email: string
  role: UserRole
  status: Status
  date: string
}

export interface UserManagement extends BaseEntity {
  name: string
  email: string
  role: UserRole
  status: Status
  joinDate: string
}

export interface AdminStats {
  totalUsers: number
  pendingApplications: number
  activeWriters: number
  activeTeachers: number
}
