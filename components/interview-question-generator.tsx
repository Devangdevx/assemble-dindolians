"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { generateQuestion } from "@/lib/ai-helpers";

interface Skill {
  id: string;
  name: string;
}

export const skills: Skill[] = [
  { id: "react", name: "React" },
  { id: "next", name: "Next" },
  { id: "nodejs", name: "Node.js" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "JavaScript + TypeScript" },
  { id: "react-native", name: "React Native" },
];

interface InterviewQuestionGeneratorProps {
  interviewType: string;
  onQuestionGenerated: (question: string) => void;
}

export default function InterviewQuestionGenerator({
  interviewType,
  onQuestionGenerated,
}: InterviewQuestionGeneratorProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestion, setGeneratedQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleGenerateQuestion = async () => {
    if (selectedSkills.length === 0) {
      alert("Please select at least one skill");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedSkillNames = selectedSkills.map(
        (id) => skills.find((skill) => skill.id === id)?.name || id
      );

      const question = await generateQuestion(
        selectedSkillNames,
        difficulty,
        interviewType
      );
      setGeneratedQuestion(question);
      onQuestionGenerated(question);
    } catch (error) {
      console.error("Error generating question:", error);
      let errorMessage = "Failed to generate question. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Generator</CardTitle>
        <CardDescription>
          Select skills and difficulty level to generate interview questions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Select Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill.id}
                    checked={selectedSkills.includes(skill.id)}
                    onCheckedChange={() => toggleSkill(skill.id)}
                  />
                  <Label htmlFor={skill.id}>{skill.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Select Difficulty</h3>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {generatedQuestion && (
            <div>
              <h3 className="text-lg font-medium mb-3">Generated Question</h3>
              <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                {generatedQuestion}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateQuestion}
          disabled={isGenerating || selectedSkills.length === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            "Generate Question"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
