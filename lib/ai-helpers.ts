import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateQuestion(skills: string[], difficulty: string, interviewType: string): Promise<string> {
  const skillsString = skills.join(", ")

  const prompt = `
    Generate a detailed coding interview question for a ${interviewType} interview.
    Skills to test: ${skillsString}
    Difficulty level: ${difficulty}
    
    The question should include:
    1. A clear problem statement
    2. Input/output examples
    3. Constraints and edge cases
    4. Expected time and space complexity requirements
    
    Format the question in a clear, structured way that would be easy for an interviewer to present.
  `

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Please check your environment variables.")
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text
  } catch (error) {
    console.error("Error generating question:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate question: ${error.message}`)
    }
    throw new Error("Failed to generate question")
  }
}

export async function evaluateCode(question: string, code: string): Promise<string> {
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
  `

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Please check your environment variables.")
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.3,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error("Error evaluating code:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to evaluate code: ${error.message}`)
    }
    throw new Error("Failed to evaluate code")
  }
}

export async function generateFollowUpQuestions(question: string, code: string, evaluation: string): Promise<string[]> {
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
  `

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Please check your environment variables.")
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 800,
    })

    // Parse the numbered list into an array of questions
    const questions = text
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\.\s/))
      .map((line) => line.replace(/^\d+\.\s/, "").trim())

    return questions
  } catch (error) {
    console.error("Error generating follow-up questions:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate follow-up questions: ${error.message}`)
    }
    throw new Error("Failed to generate follow-up questions")
  }
}

export async function generateAssessment(position: string, interviewType: string): Promise<string> {
  // In a real application, we would pass all the interview data, questions, and code
  const prompt = `
    Generate a comprehensive assessment for a candidate who interviewed for a ${position} position.
    This was a ${interviewType} interview.
    
    The assessment should include:
    1. Technical proficiency evaluation
    2. Problem-solving approach analysis
    3. Code quality assessment
    4. Areas of strength
    5. Areas for improvement
    6. Overall recommendation (Hire, Consider, Do Not Hire)
    7. Numerical score (1-10) with breakdown by skill
    
    Format the assessment in a professional manner suitable for sharing with the hiring team.
    Include specific examples and observations to support your evaluation.
  `

  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Please check your environment variables.")
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.4,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error("Error generating assessment:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate assessment: ${error.message}`)
    }
    throw new Error("Failed to generate assessment")
  }
}

