"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { evaluateCode, generateFollowUpQuestions } from "@/lib/ai-helpers"

interface AIEvaluationProps {
  question: string
  code: string
  onEvaluationComplete: (evaluation: string) => void
}

export default function AIEvaluation({ question, code, onEvaluationComplete }: AIEvaluationProps) {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false)
  const [evaluation, setEvaluation] = useState<string>("")
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [interviewerNotes, setInterviewerNotes] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("evaluation")

  useEffect(() => {
    if (question && code) {
      handleEvaluate()
    }
  }, [question, code])

  const handleEvaluate = async () => {
    if (!question || !code) {
      alert("Question and code are required for evaluation")
      return
    }

    setIsEvaluating(true)
    try {
      const result = await evaluateCode(question, code)
      setEvaluation(result)
      onEvaluationComplete(result)

      // Generate follow-up questions
      try {
        const questions = await generateFollowUpQuestions(question, code, result)
        setFollowUpQuestions(questions)
      } catch (followUpError) {
        console.error("Error generating follow-up questions:", followUpError)
        // Don't block the main evaluation if follow-up questions fail
      }
    } catch (error) {
      console.error("Error evaluating code:", error)
      let errorMessage = "Failed to evaluate code. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setEvaluation(errorMessage)
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Evaluation</CardTitle>
        <CardDescription>AI-powered analysis of the candidate's solution</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="evaluation">Code Evaluation</TabsTrigger>
            <TabsTrigger value="followup">Follow-up Questions</TabsTrigger>
            <TabsTrigger value="notes">Interviewer Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="evaluation">
            {isEvaluating ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Evaluating code...</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap p-4 bg-muted rounded-md">
                {evaluation || "No evaluation generated yet."}
              </div>
            )}
          </TabsContent>

          <TabsContent value="followup">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Suggested Follow-up Questions</h3>
              {followUpQuestions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {followUpQuestions.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  {isEvaluating ? "Generating follow-up questions..." : "No follow-up questions generated yet."}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Interviewer Notes</h3>
              <Textarea
                placeholder="Add your notes about the candidate's performance, communication skills, problem-solving approach, etc."
                value={interviewerNotes}
                onChange={(e) => setInterviewerNotes(e.target.value)}
                rows={10}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleEvaluate} disabled={isEvaluating || !code}>
          Re-evaluate
        </Button>
        <Button onClick={() => setActiveTab("followup")} disabled={followUpQuestions.length === 0}>
          View Follow-up Questions
        </Button>
      </CardFooter>
    </Card>
  )
}

