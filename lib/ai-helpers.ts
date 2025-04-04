// Mock data generators for interview assessment tool

// Generate a coding interview question based on skills and difficulty
export async function generateQuestion(skills: string[], difficulty: string, interviewType: string): Promise<string> {
  const skillsString = skills.join(", ")

  // Return a mock question based on the interview type and skills
  if (interviewType === "algorithm") {
    return `
# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Algorithm Challenge

## Problem Statement
Write a function that finds the maximum sum of a contiguous subarray within an array of integers.

## Examples
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: The contiguous subarray [4, -1, 2, 1] has the largest sum = 6.

Input: [1]
Output: 1

Input: [-1]
Output: -1

## Constraints
- The array will contain at least one element
- The array can contain both positive and negative integers
- The array length will not exceed 10^5

## Expected Time and Space Complexity
- Time Complexity: O(n) where n is the length of the array
- Space Complexity: O(1)

This problem tests your knowledge of ${skillsString} and dynamic programming concepts.
`
  } else if (interviewType === "system-design") {
    return `
# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level System Design Challenge

## Problem Statement
Design a URL shortening service like bit.ly or TinyURL.

## Requirements
1. Users should be able to create a shortened URL from a long URL
2. Users should be redirected to the original URL when they access the shortened URL
3. The system should handle high traffic and be scalable
4. URLs should expire after a standard period of time

## Expected Components to Consider
1. API design
2. Database schema
3. Encoding/hashing mechanism
4. Scalability approach
5. Caching strategy

## Additional Considerations
- How would you handle analytics for URL clicks?
- How would you prevent abuse of the service?
- How would you handle custom short URLs?

This problem tests your knowledge of ${skillsString} and system design principles.
`
  } else if (interviewType === "behavioral") {
    return `
# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Behavioral Question

## Scenario
Describe a situation where you had to work with a difficult team member on a project with a tight deadline. How did you handle the situation, and what was the outcome?

## Follow-up Questions
1. What specific strategies did you use to communicate with this team member?
2. How did you ensure the project stayed on track despite the interpersonal challenges?
3. What did you learn from this experience that you've applied to subsequent team interactions?
4. If you could go back, what would you do differently?

This question assesses your interpersonal skills, conflict resolution abilities, and self-awareness.
`
  } else {
    // Default technical interview question
    return `
# ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level Technical Challenge

## Problem Statement
Implement a function that converts a given string into a valid JSON object. The function should handle nested objects, arrays, and primitive values.

## Examples
Input: '{"name":"John","age":30,"skills":["JavaScript","React"]}'
Output: { name: "John", age: 30, skills: ["JavaScript", "React"] }

Input: '{"user":{"id":1,"profile":{"verified":true}}}'
Output: { user: { id: 1, profile: { verified: true } } }

## Requirements
1. The function should validate the input string and throw an error if it's not valid JSON
2. The function should handle all valid JSON data types
3. The function should properly parse nested structures

## Edge Cases to Consider
- Empty objects and arrays
- Special characters in strings
- Numeric values (integers, floats)
- Boolean values and null

This problem tests your knowledge of ${skillsString} and string parsing concepts.
`
  }
}

// Evaluate code solution for a given question
export async function evaluateCode(question: string, code: string): Promise<string> {
  // Return a mock evaluation
  return `
## Evaluation of Candidate's Solution

### Correctness: 8/10
The solution correctly implements the core algorithm to find the maximum subarray sum. The approach uses Kadane's algorithm, which is the optimal solution for this problem.

### Efficiency: 9/10
- Time Complexity: O(n) - The solution iterates through the array once.
- Space Complexity: O(1) - The solution uses a constant amount of extra space.

This is the optimal time and space complexity for this problem.

### Code Quality: 7/10
- The code is concise and readable.
- Variable names are descriptive.
- The solution follows a logical structure.
- Comments would have improved readability and explained the approach.

### Edge Cases: 8/10
The solution handles:
- Arrays with all negative numbers
- Single element arrays
- Arrays with mixed positive and negative numbers

### Potential Improvements:
1. Add input validation to check if the input is a valid array.
2. Add comments to explain the algorithm's logic.
3. Consider handling empty arrays (though the problem states there will be at least one element).
4. Could add a more descriptive function name like "findMaxSubarraySum".

Overall, this is a strong solution that demonstrates good understanding of dynamic programming and array manipulation.
`
}

// Generate follow-up questions based on the question, code, and evaluation
export async function generateFollowUpQuestions(question: string, code: string, evaluation: string): Promise<string[]> {
  // Return mock follow-up questions
  return [
    "Can you explain how Kadane's algorithm works and why it's effective for this problem?",
    "How would you modify your solution to return the start and end indices of the maximum subarray?",
    "What would change in your approach if we needed to find the maximum product of a subarray instead of the sum?",
    "How would you handle an empty array input?",
    "Can you think of any real-world applications where this algorithm might be useful?",
  ]
}

// Generate a comprehensive assessment for a candidate
export async function generateAssessment(position: string, interviewType: string): Promise<string> {
  // Return a mock assessment
  return `# Candidate Assessment: John Doe
## Position: ${position}

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
The candidate demonstrated strong technical skills and problem-solving abilities that align well with our ${position} position requirements. Their code quality and communication skills were impressive, and they showed a solid foundation that would make them a valuable addition to the team.

### Numerical Score Breakdown
- JavaScript: 8.5/10
- React: 9/10
- Problem Solving: 8/10
- Code Quality: 9/10
- Communication: 8.5/10
- Overall Score: 8.5/10`
}

