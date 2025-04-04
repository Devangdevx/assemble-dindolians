"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"

interface SkillRadarChartProps {
  skillScores: Record<string, number>
}

export default function SkillRadarChart({ skillScores }: SkillRadarChartProps) {
  // Convert the skill scores object to an array format for the radar chart
  const data = Object.entries(skillScores).map(([skill, score]) => ({
    skill,
    score,
    fullMark: 10,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="skill" />
        <PolarRadiusAxis angle={30} domain={[0, 10]} />
        <Radar
          name="Candidate Skills"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}

