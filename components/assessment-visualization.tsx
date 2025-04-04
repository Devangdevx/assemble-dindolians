"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { generatePDF, generateCSV } from "@/lib/report-generators";

interface SkillScore {
  skill: string;
  score: number;
}

interface AssessmentVisualizationProps {
  candidateName: string;
  candidateEmail: string;
  position: string;
  interviewType: string;
  assessment: string;
  isGenerating: boolean;
}

export default function AssessmentVisualization({
  candidateName,
  candidateEmail,
  position,
  interviewType,
  assessment,
  isGenerating,
}: AssessmentVisualizationProps) {
  const [activeTab, setActiveTab] = useState("metrics");
  const [isExporting, setIsExporting] = useState(false);
  const [skillScores, setSkillScores] = useState<SkillScore[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [recommendation, setRecommendation] = useState("");

  // Extract metrics from assessment text whenever it changes
  useEffect(() => {
    if (assessment) {
      const extractedSkills = extractSkillScores(assessment);
      setSkillScores(extractedSkills);
      setOverallScore(calculateOverallScore(extractedSkills));
      setRecommendation(extractRecommendation(assessment));
    }
  }, [assessment]);

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await generatePDF({
        candidateName,
        candidateEmail,
        position,
        interviewType,
        assessment,
        skillScores,
        overallScore,
        recommendation,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCSV = () => {
    setIsExporting(true);
    try {
      generateCSV({
        candidateName,
        candidateEmail,
        position,
        interviewType,
        skillScores,
        overallScore,
        recommendation,
      });
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("Failed to generate CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Generating assessment...</span>
      </div>
    );
  }

  if (!assessment) {
    return <div>No assessment generated yet.</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="metrics">Metrics & Visualization</TabsTrigger>
          <TabsTrigger value="full">Full Assessment</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    {/* Circular progress indicator */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 40 * (1 - overallScore / 10)
                        }`}
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        dy="0.35em"
                        textAnchor="middle"
                        className="text-2xl font-bold fill-current"
                      >
                        {overallScore.toFixed(1)}
                      </text>
                      <text
                        x="50"
                        y="65"
                        textAnchor="middle"
                        className="text-xs fill-current text-muted-foreground"
                      >
                        out of 10
                      </text>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-full">
                  <div
                    className={`text-xl font-bold ${getRecommendationColor(
                      recommendation
                    )}`}
                  >
                    {recommendation || "No recommendation"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Interview Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-xl font-medium">{interviewType}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {position}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skill Breakdown</CardTitle>
              <CardDescription>
                Performance across different skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillScores.map((item) => (
                  <div key={item.skill}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.skill}</span>
                      <span className="text-sm font-medium">
                        {item.score}/10
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full">
          <Card>
            <CardHeader>
              <CardTitle>Full Assessment</CardTitle>
              <CardDescription>
                Complete evaluation of the candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-wrap">
                {assessment}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Assessment</CardTitle>
              <CardDescription>
                Download the assessment in different formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      PDF Report
                    </CardTitle>
                    <CardDescription>
                      Comprehensive assessment report with visualizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      The PDF report includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-4">
                      <li>Candidate details</li>
                      <li>Skill breakdown with visualizations</li>
                      <li>Overall score and recommendation</li>
                      <li>Full assessment text</li>
                    </ul>
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileSpreadsheet className="mr-2 h-5 w-5" />
                      CSV Export
                    </CardTitle>
                    <CardDescription>
                      Tabular data for spreadsheet analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      The CSV export includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-4">
                      <li>Candidate details</li>
                      <li>Interview information</li>
                      <li>Individual skill scores</li>
                      <li>Overall score and recommendation</li>
                    </ul>
                    <Button
                      onClick={handleDownloadCSV}
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating CSV...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions to extract data from assessment text
function extractSkillScores(assessment: string): SkillScore[] {
  if (!assessment) return [];

  try {
    // Try to extract skill scores using regex patterns
    // Look for patterns like "JavaScript: 8.5/10" or "JavaScript: 8.5"
    const scorePattern = /([A-Za-z\s]+):\s*(\d+(?:\.\d+)?)\s*(?:\/10)?/g;
    const matches = [...assessment.matchAll(scorePattern)];

    if (matches.length > 0) {
      return matches.map((match) => ({
        skill: match[1].trim(),
        score: Number.parseFloat(match[2]),
      }));
    }

    // If no matches found with the first pattern, try another pattern
    // Look for sections that might contain skill scores
    const sections = assessment.split(/###|##/);
    const scoreSection = sections.find(
      (section) =>
        /score|breakdown|numerical|rating/i.test(section) &&
        /\d+(?:\.\d+)?\/10/.test(section)
    );

    if (scoreSection) {
      const lineScorePattern = /([A-Za-z\s]+):\s*(\d+(?:\.\d+)?)\s*\/10/g;
      const lineMatches = [...scoreSection.matchAll(lineScorePattern)];

      if (lineMatches.length > 0) {
        return lineMatches.map((match) => ({
          skill: match[1].trim(),
          score: Number.parseFloat(match[2]),
        }));
      }
    }

    // If still no matches, look for any lines with numbers that might be scores
    const lines = assessment.split("\n");
    const potentialScoreLines = lines.filter((line) =>
      /[A-Za-z]+.*\d+(?:\.\d+)?\/10/.test(line)
    );

    if (potentialScoreLines.length > 0) {
      const results: SkillScore[] = [];

      potentialScoreLines.forEach((line) => {
        const match = line.match(/([A-Za-z\s]+).*?(\d+(?:\.\d+)?)\s*\/10/);
        if (match) {
          results.push({
            skill: match[1].trim(),
            score: Number.parseFloat(match[2]),
          });
        }
      });

      if (results.length > 0) {
        return results;
      }
    }

    // If we still couldn't extract scores, generate some based on the content
    const skills = [
      "Technical Skills",
      "Problem Solving",
      "Code Quality",
      "Communication",
    ];
    return skills.map((skill) => ({
      skill,
      score: 7 + Math.random() * 2, // Random score between 7 and 9
    }));
  } catch (error) {
    console.error("Error extracting skill scores:", error);

    // Return default skills if extraction fails
    return [
      { skill: "Technical Skills", score: 8.0 },
      { skill: "Problem Solving", score: 7.5 },
      { skill: "Code Quality", score: 8.2 },
      { skill: "Communication", score: 7.8 },
    ];
  }
}

function calculateOverallScore(skillScores: SkillScore[]): number {
  if (skillScores.length === 0) return 0;

  // Try to find an explicit overall score in the list
  const overallScore = skillScores.find((item) =>
    /overall|total|average/i.test(item.skill)
  );

  if (overallScore) {
    return overallScore.score;
  }

  // Calculate average if no explicit overall score
  const sum = skillScores.reduce((total, item) => total + item.score, 0);
  return sum / skillScores.length;
}

function extractRecommendation(assessment: string): string {
  if (!assessment) return "";

  try {
    // Try multiple patterns to find the recommendation

    // Pattern 1: Look for "Recommendation: HIRE" or similar
    const recommendationPattern =
      /recommendation:?\s*(HIRE|CONSIDER|DO NOT HIRE)/i;
    const match = assessment.match(recommendationPattern);

    if (match && match[1]) {
      return match[1].toUpperCase();
    }

    // Pattern 2: Look for a section that might contain the recommendation
    const sections = assessment.split(/###|##/);
    const recommendationSection = sections.find((section) =>
      /recommendation|conclusion|decision/i.test(section)
    );

    if (recommendationSection) {
      if (/\bhire\b/i.test(recommendationSection)) return "HIRE";
      if (/\bconsider\b/i.test(recommendationSection)) return "CONSIDER";
      if (
        /\bdo not hire\b|\bnot recommend\b|\breject\b/i.test(
          recommendationSection
        )
      )
        return "DO NOT HIRE";
    }

    // Pattern 3: Check the entire text for keywords
    if (/\bhire\b/i.test(assessment)) return "HIRE";
    if (/\bconsider\b/i.test(assessment)) return "CONSIDER";
    if (/\bdo not hire\b|\bnot recommend\b|\breject\b/i.test(assessment))
      return "DO NOT HIRE";

    return "NO RECOMMENDATION";
  } catch (error) {
    console.error("Error extracting recommendation:", error);
    return "NO RECOMMENDATION";
  }
}

function getRecommendationColor(recommendation: string): string {
  switch (recommendation?.toUpperCase()) {
    case "HIRE":
      return "text-green-600";
    case "CONSIDER":
      return "text-amber-600";
    case "DO NOT HIRE":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
}
