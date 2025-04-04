import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateQuestion(
  skills: string[],
  difficulty: string,
  interviewType: string
): Promise<string> {
  const skillsString = skills.join(", ");
  // Map interviewType to experience level or use a default
  const experienceLevel = interviewType.toLowerCase().includes("senior")
    ? "senior"
    : interviewType.toLowerCase().includes("junior")
    ? "junior"
    : "mid-level";
  // Default to 1 question
  const numberOfQuestions = 1;

  // Customize the prompt based on interview type
  let promptTemplate = `
    Generate ${numberOfQuestions} practical ${difficulty} coding questions for a ${experienceLevel} Software Engineer position, specifically focusing on ${skillsString}.`;

  // Add specific structure based on interview type
  if (interviewType.toLowerCase().includes("algorithm")) {
    promptTemplate += `
    Focus on algorithm challenges that test problem-solving abilities with ${skillsString}.`;
  } else if (interviewType.toLowerCase().includes("system")) {
    promptTemplate += `
    Focus on system design challenges relevant to ${skillsString} implementation.`;
  } else if (interviewType.toLowerCase().includes("behavioral")) {
    promptTemplate += `
    Focus on technical scenarios that would reveal behavioral traits and soft skills in ${skillsString} environments.`;
  }

  promptTemplate += `
    Each question should:
    1. Present a concrete problem that requires writing actual code
    2. Include clear requirements and constraints
    3. Specify expected inputs and outputs
    4. Provide a small example case with solution
    5. Include at least one edge case to consider
    6. Be appropriate for a ${experienceLevel} developer's skill level in ${skillsString}
    7. Focus on practical application rather than theoretical concepts
    8. Be solvable within a 30-minute interview session
    9. Require demonstrating knowledge of common patterns, data structures, or algorithms relevant to ${skillsString}
    10. Include a brief explanation of what skills/knowledge the question is designed to evaluate

    Format each question with:
    - Problem statement
    - Input/Output format
    - Constraints
    - Example(s)
    - Edge case consideration
    - Follow-up question (if the candidate solves it quickly)
  `;

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is missing. Please check your environment variables."
      );
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o", // or gpt-4 / gpt-3.5-turbo
      messages: [{ role: "user", content: promptTemplate }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return chatCompletion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating question:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate question: ${error.message}`);
    }
    throw new Error("Failed to generate question");
  }
}

export async function evaluateCode(
  question: string,
  code: string
): Promise<string> {
  const prompt = `
    Evaluate the following code solution for this interview question:
    
    QUESTION:
    ${question}
    
    CODE SOLUTION:
    ${code}
    
    Please provide a comprehensive evaluation covering:
    1. Correctness: Does the solution solve the problem correctly?
    2. Efficiency: Analyze the time and space complexity.
    3. Code quality: Is the code well-structured, readable, and following best practices?
    4. Edge cases: Does it handle edge cases properly?
    5. Potential improvements: How could the solution be optimized?
    
    Format your evaluation in a clear, structured way that would be helpful for an interviewer.
  `;

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is missing. Please check your environment variables."
      );
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    return chatCompletion.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Error evaluating code:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to evaluate code: ${error.message}`);
    }
    throw new Error("Failed to evaluate code");
  }
}

export async function generateFollowUpQuestions(
  question: string,
  code: string,
  evaluation: string
): Promise<string[]> {
  const prompt = `
    Based on the following interview question, candidate's code solution, and evaluation:
    
    QUESTION:
    ${question}
    
    CODE SOLUTION:
    ${code}
    
    EVALUATION:
    ${evaluation}
    
    Generate 3-5 follow-up questions that an interviewer could ask to further assess the candidate's understanding.
    These questions should:
    1. Probe deeper into their solution approach
    2. Test their understanding of potential optimizations
    3. Explore how they would handle variations of the problem
    4. Assess their knowledge of related concepts
    
    Return ONLY the questions as a numbered list, without any additional text.
  `;

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is missing. Please check your environment variables."
      );
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = chatCompletion.choices[0].message.content || "";

    // Parse the numbered list into an array of questions
    const questions = text
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\.\s/))
      .map((line) => line.replace(/^\d+\.\s/, "").trim());

    return questions;
  } catch (error) {
    console.error("Error generating follow-up questions:", error);
    if (error instanceof Error) {
      throw new Error(
        `Failed to generate follow-up questions: ${error.message}`
      );
    }
    throw new Error("Failed to generate follow-up questions");
  }
}

export async function generateAssessment(
  position: string,
  interviewType: string
): Promise<string> {
  // In a real application, we would pass all the interview data, questions, and code
  const prompt = `
    Generate a comprehensive assessment for a candidate who interviewed for a ${position} position.
    This was a ${interviewType} interview.
    
    The assessment must follow this exact structure:

    ## Executive Summary
    [Brief overview of candidate performance]

    ## Technical Proficiency
    [Detailed assessment of technical skills]

    ## Problem-solving Approach
    [Analysis of how the candidate approached problems]

    ## Code Quality
    [Assessment of code structure, readability, and best practices]

    ## Strengths
    [Bullet points of the candidate's strong areas]

    ## Areas for Improvement
    [Bullet points of where the candidate could improve]

    ## Skill Scores
    Technical Skills: [score]/10
    Problem Solving: [score]/10
    Code Quality: [score]/10
    Communication: [score]/10
    [Add any other relevant skills]

    ## Overall Score
    Overall: [score]/10

    ## Recommendation: [HIRE, CONSIDER, or DO NOT HIRE]

    [Final thoughts and justification for recommendation]

    Important: 
    1. Use clear headings exactly as shown above
    2. Ensure all skill scores are formatted as "Skill Name: X/10" where X is a number between 1-10
    3. Provide an explicit overall score between 1-10
    4. Make the recommendation clear by using exactly one of: HIRE, CONSIDER, or DO NOT HIRE
    `;

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OpenAI API key is missing. Please check your environment variables."
      );
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1500,
    });

    return chatCompletion.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Error generating assessment:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate assessment: ${error.message}`);
    }
    throw new Error("Failed to generate assessment");
  }
}
