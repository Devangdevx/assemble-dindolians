import { jsPDF } from "jspdf";
// Import jspdf-autotable properly
import autoTable from "jspdf-autotable";

// Add type declaration for autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface ReportData {
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewType: string;
  skillScores: { skill: string; score: number }[];
  overallScore: number;
  recommendation: string;
  assessment?: string;
}

export async function generatePDF(data: ReportData): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("INTERVIEW ASSESSMENT REPORT", 105, 20, { align: "center" });

  // Add candidate information section
  doc.setFontSize(16);
  doc.text("CANDIDATE INFORMATION", 14, 40);
  doc.setFontSize(12);
  doc.text(`Name: ${data.candidateName}`, 14, 50);
  doc.text(`Email: ${data.candidateEmail}`, 14, 58);
  doc.text(`Position: ${data.position}`, 14, 66);
  doc.text(`Interview Type: ${data.interviewType}`, 14, 74);

  // Add assessment summary section
  doc.setFontSize(16);
  doc.text("ASSESSMENT SUMMARY", 14, 90);
  doc.setFontSize(12);
  doc.text(`Overall Score: ${data.overallScore.toFixed(1)}/10`, 14, 100);
  doc.text(`Recommendation: ${data.recommendation}`, 14, 108);

  // Add skill breakdown section
  doc.setFontSize(16);
  doc.text("SKILL BREAKDOWN", 14, 124);

  // Create a table for skills
  const skillTableData = data.skillScores.map((item) => [
    item.skill,
    `${item.score}/10`,
  ]);

  // Fixed autoTable call - remove the doc parameter
  autoTable(doc, {
    startY: 130,
    head: [["Skill", "Score"]],
    body: skillTableData,
    theme: "striped",
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Add full assessment if available
  if (data.assessment) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text("FULL ASSESSMENT", 14, 20);
    doc.setFontSize(10);

    // Split the assessment text into lines to fit on the page
    const splitText = doc.splitTextToSize(data.assessment, 180);
    doc.text(splitText, 14, 30);
  }

  // Save the PDF
  doc.save(`${data.candidateName.replace(/\s+/g, "_")}_Assessment.pdf`);
}

// Function to generate and download a CSV report
export function generateCSV(data: ReportData): void {
  // Create CSV header
  let csvContent = "data:text/csv;charset=utf-8,";

  // Add candidate information
  csvContent +=
    "Candidate Name,Email,Position,Interview Type,Overall Score,Recommendation\n";
  csvContent += `${data.candidateName},${data.candidateEmail},${
    data.position
  },${data.interviewType},${data.overallScore.toFixed(1)},${
    data.recommendation
  }\n\n`;

  // Add skill scores
  csvContent += "Skill,Score\n";
  data.skillScores.forEach((item) => {
    csvContent += `${item.skill},${item.score}\n`;
  });

  // Create a download link and trigger the download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `${data.candidateName.replace(/\s+/g, "_")}_Assessment.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
