// This file contains functions to generate PDF and CSV reports

interface ReportData {
  candidateName: string
  candidateEmail: string
  position: string
  interviewType: string
  skillScores: { skill: string; score: number }[]
  overallScore: number
  recommendation: string
  assessment?: string
}

// Function to generate and download a PDF report
export async function generatePDF(data: ReportData): Promise<void> {
  // In a real implementation, we would use a library like jsPDF or react-pdf
  // For this demo, we'll simulate PDF generation with a timeout

  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a simple text representation of the PDF content
      const content = `
INTERVIEW ASSESSMENT REPORT
==========================

CANDIDATE INFORMATION
--------------------
Name: ${data.candidateName}
Email: ${data.candidateEmail}
Position: ${data.position}
Interview Type: ${data.interviewType}

ASSESSMENT SUMMARY
-----------------
Overall Score: ${data.overallScore.toFixed(1)}/10
Recommendation: ${data.recommendation}

SKILL BREAKDOWN
--------------
${data.skillScores.map((item) => `${item.skill}: ${item.score}/10`).join("\n")}

FULL ASSESSMENT
--------------
${data.assessment || "No detailed assessment available."}
`

      // Create a Blob with the content
      const blob = new Blob([content], { type: "application/pdf" })

      // Create a download link and trigger the download
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${data.candidateName.replace(/\s+/g, "_")}_Assessment.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      resolve()
    }, 1500) // Simulate processing time
  })
}

// Function to generate and download a CSV report
export function generateCSV(data: ReportData): void {
  // Create CSV header
  let csvContent = "data:text/csv;charset=utf-8,"

  // Add candidate information
  csvContent += "Candidate Name,Email,Position,Interview Type,Overall Score,Recommendation\n"
  csvContent += `${data.candidateName},${data.candidateEmail},${data.position},${data.interviewType},${data.overallScore.toFixed(1)},${data.recommendation}\n\n`

  // Add skill scores
  csvContent += "Skill,Score\n"
  data.skillScores.forEach((item) => {
    csvContent += `${item.skill},${item.score}\n`
  })

  // Create a download link and trigger the download
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `${data.candidateName.replace(/\s+/g, "_")}_Assessment.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

