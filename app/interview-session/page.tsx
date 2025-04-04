"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import InterviewQuestionGenerator from "@/components/interview-question-generator"
import CodingEnvironment from "@/components/coding-environment"
import AIEvaluation from "@/components/ai-evaluation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InterviewData {
  candidateName: string
  candidateEmail: string
  position: string
  interviewType: string
}

export default function InterviewSession() {
  const router = useRouter()
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [candidateCode, setCandidateCode] = useState<string>("")
  const [evaluation, setEvaluation] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("question")

  useEffect(() => {
    // In a real application, we would fetch this data from a database
    const storedData = localStorage.getItem("interviewData")
    if (storedData) {
      setInterviewData(JSON.parse(storedData))
    } else {
      // If no interview data is found, redirect back to setup
      router.push("/")
    }
  }, [router])

  const handleQuestionGenerated = (question: string) => {
    setCurrentQuestion(question)
    setActiveTab("coding")
    setCandidateCode("") // Reset code when new question is generated
    setEvaluation("") // Reset evaluation when new question is generated
  }

  const handleCodeChange = (code: string) => {
    setCandidateCode(code)
  }

  const handleEvaluationComplete = (evaluationResult: string) => {
    setEvaluation(evaluationResult)
    setActiveTab("evaluation")
  }

  const handleFinishInterview = () => {
    // In a real application, we would save the interview data and navigate to a summary page
    router.push("/interview-summary")
  }

  if (!interviewData) {
    return <div className="container mx-auto py-10 px-4">Loading interview data...</div>
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Interview Session</h1>
          <p className="text-muted-foreground">
            Candidate: {interviewData.candidateName} | Position: {interviewData.position}
          </p>
        </div>
        <Button variant="outline" onClick={handleFinishInterview}>
          Finish Interview
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="question">Question Generation</TabsTrigger>
          <TabsTrigger value="coding">Coding Environment</TabsTrigger>
          <TabsTrigger value="evaluation">AI Evaluation</TabsTrigger>
        </TabsList>

        <TabsContent value="question">
          <InterviewQuestionGenerator
            interviewType={interviewData.interviewType}
            onQuestionGenerated={handleQuestionGenerated}
          />
        </TabsContent>

        <TabsContent value="coding">
          <Card>
            <CardHeader>
              <CardTitle>Coding Challenge</CardTitle>
              <CardDescription>Have the candidate solve the following problem in the code editor.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted rounded-md whitespace-pre-wrap">
                {currentQuestion || "No question generated yet. Please go to the Question Generation tab first."}
              </div>
              <CodingEnvironment
                code={candidateCode}
                onCodeChange={handleCodeChange}
                onEvaluate={() => {
                  if (currentQuestion && candidateCode) {
                    setActiveTab("evaluation")
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation">
          <AIEvaluation
            question={currentQuestion}
            code={candidateCode}
            onEvaluationComplete={handleEvaluationComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

