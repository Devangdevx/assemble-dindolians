"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CandidateComparisonChartProps {
  candidateName: string
}

export default function CandidateComparisonChart({ candidateName }: CandidateComparisonChartProps) {
  // Mock data for comparison
  // In a real application, this would come from your database
  const data = [
    {
      name: "JavaScript",
      [candidateName]: 8.5,
      Average: 7.2,
      "Top Candidate": 9.0,
    },
    {
      name: "React",
      [candidateName]: 9.0,
      Average: 7.5,
      "Top Candidate": 9.5,
    },
    {
      name: "Problem Solving",
      [candidateName]: 8.0,
      Average: 6.8,
      "Top Candidate": 9.2,
    },
    {
      name: "Code Quality",
      [candidateName]: 9.0,
      Average: 7.0,
      "Top Candidate": 8.8,
    },
    {
      name: "Communication",
      [candidateName]: 8.5,
      Average: 7.8,
      "Top Candidate": 9.0,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey={candidateName} fill="hsl(var(--primary))" />
        <Bar dataKey="Average" fill="hsl(var(--muted-foreground))" />
        <Bar dataKey="Top Candidate" fill="hsl(var(--accent))" />
      </BarChart>
    </ResponsiveContainer>
  )
}

