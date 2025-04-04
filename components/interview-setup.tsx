"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Simple validation function
const validateForm = (formData: {
  candidateName: string
  candidateEmail: string
  position: string
  interviewType: string
}) => {
  const errors: Record<string, string> = {}

  if (!formData.candidateName || formData.candidateName.length < 2) {
    errors.candidateName = "Candidate name must be at least 2 characters."
  }

  if (!formData.candidateEmail || !/^\S+@\S+\.\S+$/.test(formData.candidateEmail)) {
    errors.candidateEmail = "Please enter a valid email address."
  }

  if (!formData.position || formData.position.length < 2) {
    errors.position = "Position must be at least 2 characters."
  }

  if (!formData.interviewType) {
    errors.interviewType = "Please select an interview type."
  }

  return errors
}

export default function InterviewSetup() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    position: "",
    interviewType: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, interviewType: value }))
    // Clear error when user selects
    if (errors.interviewType) {
      setErrors((prev) => ({ ...prev, interviewType: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // In a real application, we would save this data to a database
    console.log({ ...formData, resumeFile })

    // Store interview data in localStorage for demo purposes
    localStorage.setItem("interviewData", JSON.stringify(formData))

    // Navigate to the interview session page
    router.push("/interview-session")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Interview Session</CardTitle>
        <CardDescription>Enter candidate details and set up the interview session.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="candidateName">Candidate Name</Label>
            <Input
              id="candidateName"
              name="candidateName"
              placeholder="John Doe"
              value={formData.candidateName}
              onChange={handleInputChange}
              className={errors.candidateName ? "border-red-500" : ""}
            />
            {errors.candidateName && <p className="text-sm text-red-500">{errors.candidateName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidateEmail">Candidate Email</Label>
            <Input
              id="candidateEmail"
              name="candidateEmail"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.candidateEmail}
              onChange={handleInputChange}
              className={errors.candidateEmail ? "border-red-500" : ""}
            />
            {errors.candidateEmail && <p className="text-sm text-red-500">{errors.candidateEmail}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position Applying For</Label>
            <Input
              id="position"
              name="position"
              placeholder="Frontend Developer"
              value={formData.position}
              onChange={handleInputChange}
              className={errors.position ? "border-red-500" : ""}
            />
            {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewType">Interview Type</Label>
            <Select value={formData.interviewType} onValueChange={handleSelectChange}>
              <SelectTrigger id="interviewType" className={errors.interviewType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Interview</SelectItem>
                <SelectItem value="algorithm">Algorithm & Data Structures</SelectItem>
                <SelectItem value="system-design">System Design</SelectItem>
                <SelectItem value="behavioral">Behavioral Interview</SelectItem>
              </SelectContent>
            </Select>
            {errors.interviewType && <p className="text-sm text-red-500">{errors.interviewType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Upload Resume</Label>
            <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            <p className="text-sm text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
          </div>

          <Button type="submit" className="w-full">
            Create Interview Session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

