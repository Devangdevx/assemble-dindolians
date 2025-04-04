"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Save } from "lucide-react";
import CandidateComparisonChart from "@/components/candidate-comparison-chart";
import SkillRadarChart from "@/components/skill-radar-chart";
import AssessmentVisualization from "@/components/assessment-visualization";

// Mock data for a specific interview
const mockInterviewData = {
  id: "1",
  candidateName: "John Doe",
  candidateEmail: "john.doe@example.com",
  position: "Frontend Developer",
  interviewType: "Technical Interview",
  date: "2025-04-01",
  status: "Completed",
  score: 8.5,
  recommendation: "Hire",
  questions: [
    {
      id: "q1",
      question:
        "Implement a function that finds the longest substring without repeating characters in a given string.",
      skills: ["Algorithms", "JavaScript"],
      difficulty: "Medium",
      candidateCode: `function lengthOfLongestSubstring(s) {
  let maxLength = 0;
  let start = 0;
  const charMap = new Map();
  
  for (let end = 0; end < s.length; end++) {
    const currentChar = s[end];
    
    if (charMap.has(currentChar) && charMap.get(currentChar) >= start) {
      start = charMap.get(currentChar) + 1;
    }
    
    charMap.set(currentChar, end);
    maxLength = Math.max(maxLength, end - start + 1);
  }
  
  return maxLength;
}`,
      evaluation: `Correctness: The solution correctly solves the problem by using a sliding window approach with a hash map to track character positions.

Efficiency:
- Time Complexity: O(n) where n is the length of the string. Each character is processed once.
- Space Complexity: O(min(m, n)) where m is the size of the character set and n is the string length.

Code Quality:
- Well-structured and readable
- Good variable naming
- Clean implementation of the sliding window algorithm

Edge Cases:
- Handles empty strings correctly (returns 0)
- Handles strings with all unique characters
- Handles strings with repeated characters

Potential Improvements:
- Could add input validation
- Could optimize space by using a fixed-size array if the character set is known (e.g., ASCII)

Overall, this is an excellent solution that demonstrates strong algorithmic understanding and coding ability.`,
    },
    {
      id: "q2",
      question:
        "Create a React component that fetches and displays a list of users from an API, with loading and error states.",
      skills: ["React", "API Integration"],
      difficulty: "Medium",
      candidateCode: `import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User List</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;`,
      evaluation: `Correctness: The solution correctly implements a React component that fetches data from an API and handles different states appropriately.

Efficiency:
- The component follows React best practices with proper use of useState and useEffect hooks
- The fetch operation is triggered only once on component mount

Code Quality:
- Well-structured with clear separation of concerns
- Good error handling with appropriate user feedback
- Clean conditional rendering for different states

Edge Cases:
- Handles loading state
- Handles error state
- Handles empty data state

Potential Improvements:
- Could add a retry mechanism for failed requests
- Could implement pagination for large datasets
- Could add TypeScript for better type safety
- Could extract the data fetching logic into a custom hook for reusability

Overall, this is a solid implementation that demonstrates good understanding of React patterns and asynchronous data fetching.`,
    },
  ],
  assessment: `# Candidate Assessment: John Doe
## Position: Frontend Developer

### Technical Proficiency
The candidate demonstrated strong technical skills across multiple areas:
- **JavaScript**: Excellent understanding of core concepts and algorithms (8.5/10)
- **React**: Strong knowledge of React patterns and best practices (9/10)
- **Problem Solving**: Methodical approach to breaking down complex problems (8/10)
- **API Integration**: Good understanding of asynchronous operations and error handling (8.5/10)

### Problem-Solving Approach
The candidate approached problems methodically, first ensuring they understood the requirements before implementing solutions. They demonstrated the ability to:
- Consider edge cases proactively
- Optimize for both time and space complexity
- Articulate their thought process clearly while coding

### Code Quality
- **Readability**: Code was well-structured and easy to follow (9/10)
- **Naming Conventions**: Used descriptive variable and function names (8.5/10)
- **Error Handling**: Implemented robust error handling (8/10)
- **Best Practices**: Followed modern JavaScript and React best practices (9/10)

### Areas of Strength
1. Algorithm implementation with optimal time/space complexity
2. React component architecture and state management
3. Clear communication of technical concepts
4. Error handling and edge case consideration

### Areas for Improvement
1. Could benefit from more experience with advanced React patterns (e.g., custom hooks)
2. Testing knowledge appeared somewhat limited
3. Could improve on system design considerations for larger applications

### Overall Recommendation: HIRE
The candidate demonstrated strong technical skills and problem-solving abilities that align well with our frontend developer position requirements. Their code quality and communication skills were impressive, and they showed a solid foundation that would make them a valuable addition to the team.

### Numerical Score Breakdown
- JavaScript: 8.5/10
- React: 9/10
- Problem Solving: 8/10
- Code Quality: 9/10
- Communication: 8.5/10
- Overall Score: 8.5/10`,
  skillScores: {
    JavaScript: 8.5,
    React: 9.0,
    "Problem Solving": 8.0,
    "Code Quality": 9.0,
    Communication: 8.5,
    "API Integration": 8.5,
    Testing: 6.5,
    "System Design": 7.0,
  },
  interviewerNotes:
    "John showed excellent problem-solving skills and was able to articulate his thought process clearly. He was receptive to feedback and quick to implement suggestions. His React knowledge is strong, particularly in functional components and hooks. Would be a good fit for our frontend team.",
};

export default function InterviewSummaryDetail() {
  const router = useRouter();
  const params = useParams();
  const [interviewData, setInterviewData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAssessment, setEditedAssessment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // In a real application, we would fetch the interview data from an API
    // For now, we'll use mock data
    setInterviewData(mockInterviewData);
    setEditedAssessment(mockInterviewData.assessment);
  }, [params.id]);

  const handleSaveAssessment = () => {
    setInterviewData({
      ...interviewData,
      assessment: editedAssessment,
    });
    setIsEditing(false);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  if (!interviewData) {
    return (
      <div className="container mx-auto py-10 px-4">
        Loading interview data...
      </div>
    );
  }
  console.log("interviewData.skillScores", interviewData);
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToDashboard}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="ml-2">
          <h1 className="text-3xl font-bold">{interviewData.candidateName}</h1>
          <p className="text-muted-foreground">
            {interviewData.position} |{" "}
            {new Date(interviewData.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{interviewData.score}/10</div>
            <div className="mt-2">
              <Badge
                variant={
                  interviewData.recommendation === "Hire"
                    ? "default"
                    : interviewData.recommendation === "Consider"
                    ? "secondary"
                    : "destructive"
                }
              >
                {interviewData.recommendation}
              </Badge>
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
            <div className="text-xl font-medium">
              {interviewData.interviewType}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {interviewData.questions.length} questions asked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {interviewData.candidateEmail}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {interviewData.candidateName}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions & Code</TabsTrigger>
          <TabsTrigger value="skills">Skill Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Candidate Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Assessment</CardTitle>
                    <CardDescription>
                      AI-generated evaluation of the candidate
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <Button size="sm" onClick={handleSaveAssessment}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editedAssessment}
                      onChange={(e) => setEditedAssessment(e.target.value)}
                      className="min-h-[500px] font-mono"
                    />
                  ) : (
                    <AssessmentVisualization
                      candidateName={interviewData.candidateName}
                      candidateEmail={interviewData.candidateEmail}
                      position={interviewData.position}
                      interviewType={interviewData.interviewType}
                      assessment={interviewData.assessment}
                      isGenerating={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                  <CardDescription>
                    Performance across different skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillRadarChart skillScores={interviewData.skillScores} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Interviewer Notes</CardTitle>
                  <CardDescription>
                    Additional observations from the interviewer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap">
                    {interviewData.interviewerNotes}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions & Code</CardTitle>
              <CardDescription>
                Questions asked during the interview and candidate's solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {interviewData.questions.map((q: any, index: number) => (
                  <div key={q.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">
                          Question {index + 1}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {q.skills.map((skill: string) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          <Badge>{q.difficulty}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Problem Statement
                      </h4>
                      <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                        {q.question}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Candidate's Solution
                      </h4>
                      <div className="p-4 bg-black text-white rounded-md overflow-x-auto">
                        <pre className="whitespace-pre-wrap">
                          {q.candidateCode}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        AI Evaluation
                      </h4>
                      <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                        {q.evaluation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Skill Analysis</CardTitle>
              <CardDescription>
                In-depth evaluation of technical and soft skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Technical Skills</h3>
                  <div className="space-y-4">
                    {Object.entries(interviewData.skillScores)
                      .filter(
                        ([skill]) =>
                          !["Communication", "Problem Solving"].includes(skill)
                      )
                      .map(([skill, score]) => (
                        <div key={skill}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill}</span>
                            <span className="text-sm font-medium">
                              {String(score)}/10
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{
                                width: `${(Number(score) / 10) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Soft Skills & Problem Solving
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(interviewData.skillScores)
                      .filter(([skill]) =>
                        ["Communication", "Problem Solving"].includes(skill)
                      )
                      .map(([skill, score]) => (
                        <div key={skill}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{skill}</span>
                            <span className="text-sm font-medium">
                              {String(score)}/10
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{
                                width: `${(Number(score) / 10) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Comparison</CardTitle>
              <CardDescription>
                Compare this candidate with others who interviewed for similar
                positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CandidateComparisonChart
                candidateName={interviewData.candidateName}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
