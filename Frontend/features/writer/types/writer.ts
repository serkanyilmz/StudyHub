import type { BaseEntity } from "@/shared/types/common"

export interface WriterStats {
  questionsCreated: number
  quizzesPublished: number
  aiSuggestionsUsed: number
  totalViews: number
}

export interface ImportHistory extends BaseEntity {
  fileName: string
  status: "Completed" | "Processing" | "Failed"
  questionsExtracted: number
  uploadDate: string
}
