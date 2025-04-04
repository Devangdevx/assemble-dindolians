import type { Metadata } from "next"
import InterviewSetup from "@/components/interview-setup"

export const metadata: Metadata = {
  title: "Interview Assessment Tool",
  description: "AI-powered technical interview assessment tool",
}

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-6">Interview Assessment Tool</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Streamline technical interviews with AI assistance for question generation, evaluation, and candidate
        assessment.
      </p>
      <InterviewSetup />
    </main>
  )
}

