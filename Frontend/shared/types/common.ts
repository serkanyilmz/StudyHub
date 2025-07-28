import type React from "react"
export interface StatCard {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export type Status = "active" | "inactive" | "pending" | "approved" | "completed" | "draft" | "published"

export interface BaseEntity {
  id: number | string
  createdAt?: string
  updatedAt?: string
}
