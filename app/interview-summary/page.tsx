"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generateAssessment } from "@/lib/ai-helpers"
import AssessmentVisualization from "@/components/assessment-visualization"

interface InterviewData {
  candidateName: string
  candidateEmail: string
  position: string
  interviewType: string
}

export default function InterviewSummary() {
  const router = useRouter()
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const [assessment, setAssessment] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // In a real application, we would fetch this data from a database
    const storedData = localStorage.getItem("interviewData")
    if (storedData) {
      setInterviewData(JSON.parse(storedData))
      generateFinalAssessment()
    } else {
      // If no interview data is found, redirect back to setup
      router.push("/")
    }
  }, [router])

  const generateFinalAssessment = async () => {
    setIsGenerating(true)
    setError("")

    // Using setTimeout to simulate API call delay
    setTimeout(async () => {
      try {
        // Get interview data
        const storedData = localStorage.getItem("interviewData")
        if (!storedData) {
          throw new Error("No interview data found")
        }

        const data = JSON.parse(storedData)
        const position = data.position || "React Developer"
        const interviewType = data.interviewType || "Technical Interview"

        const result = await generateAssessment(position, interviewType)
        setAssessment(result)
      } catch (error) {
        console.error("Error generating assessment:", error)
        setError("Failed to generate assessment. Please try again.")
      } finally {
        setIsGenerating(false)
      }
    }, 2500)
  }

  const handleNewInterview = () => {
    // Clear interview data and redirect to home
    localStorage.removeItem("interviewData")
    router.push("/")
  }

  if (!interviewData) {
    return <div className="container mx-auto py-10 px-4">Loading interview data...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Interview Summary</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{interviewData.candidateName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{interviewData.candidateEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Position</p>
              <p>{interviewData.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Interview Type</p>
              <p>{interviewData.interviewType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI-Generated Assessment</CardTitle>
          <CardDescription>Comprehensive evaluation of the candidate's performance</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

          <AssessmentVisualization
            candidateName={interviewData.candidateName}
            candidateEmail={interviewData.candidateEmail}
            position={interviewData.position}
            interviewType={interviewData.interviewType}
            assessment={assessment}
            isGenerating={isGenerating}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={generateFinalAssessment} disabled={isGenerating}>
            Regenerate Assessment
          </Button>
        </CardFooter>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNewInterview}>Start New Interview</Button>
      </div>
    </div>
  )
}

