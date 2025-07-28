export interface AIService {
  generateQuestionSuggestion(): Promise<string>
  categorizeQuestion(question: string): Promise<string>
  generatePerformanceInsights(data: any): Promise<string[]>
}

export class GeminiAIService implements AIService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateQuestionSuggestion(): Promise<string> {
    // Mock implementation - replace with actual Gemini API call
    const suggestions = [
      "Consider adding a multiple-choice question about React hooks with useState and useEffect examples.",
      "Create a scenario-based question about database optimization techniques.",
      "Add a coding question that tests understanding of async/await in JavaScript.",
      "Include a question about machine learning model evaluation metrics.",
    ]
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  async categorizeQuestion(question: string): Promise<string> {
    // Mock implementation - replace with actual Gemini API call
    const categories = ["Programming", "Database", "AI/ML", "Web Development", "Data Science"]
    return categories[Math.floor(Math.random() * categories.length)]
  }

  async generatePerformanceInsights(data: any): Promise<string[]> {
    // Mock implementation - replace with actual Gemini API call
    return [
      "Students are performing well in React concepts",
      "Database queries need more practice",
      "Consider adding more examples for complex topics",
    ]
  }
}
