"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Candidate name must be at least 2 characters.",
  }),
  candidateEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  interviewType: z.string({
    required_error: "Please select an interview type.",
  }),
})

export default function InterviewSetup() {
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      candidateEmail: "",
      position: "",
      interviewType: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, we would save this data to a database
    // and then redirect to the interview session page
    console.log({ ...values, resumeFile })

    // Store interview data in localStorage for demo purposes
    localStorage.setItem("interviewData", JSON.stringify(values))

    // Navigate to the interview session page
    router.push("/interview-session")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Interview Session</CardTitle>
        <CardDescription>Enter candidate details and set up the interview session.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="candidateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="candidateEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Applying For</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interviewType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technical">Technical Interview</SelectItem>
                      <SelectItem value="algorithm">Algorithm & Data Structures</SelectItem>
                      <SelectItem value="system-design">System Design</SelectItem>
                      <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="resume">Upload Resume</Label>
                <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                <p className="text-sm text-muted-foreground">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Interview Session
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

