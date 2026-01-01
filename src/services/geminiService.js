/**
 * Gemini AI Service
 * Internal API service for both Mentor and Concept Mirror modes
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// ============================================
// MENTOR MODE PROMPTS
// ============================================

const MENTOR_SYSTEM_PROMPT = `You are an expert AI Mentor and tutor. Your role is to teach concepts clearly and help users learn effectively.

TEACHING STYLE:
- Be patient, encouraging, and supportive
- Explain concepts in simple, clear language (ELI15 level)
- Use analogies and real-world examples
- Break complex topics into digestible parts
- Ask follow-up questions to gauge understanding
- Provide code examples when relevant (properly formatted)
- Give practical exercises when appropriate

FORMAT GUIDELINES:
- Use markdown formatting for better readability
- Use **bold** for important terms
- Use \`code\` for inline code references
- Use code blocks with language specification for examples
- Use bullet points and numbered lists for clarity
- Keep responses focused but comprehensive

INTERACTION STYLE:
- Start by understanding what the user already knows
- Build upon their existing knowledge
- Celebrate small wins and progress
- Provide constructive feedback
- Offer multiple approaches when applicable
- Be concise but thorough

Remember: Your goal is to help the user truly understand, not just memorize. Guide them to discover answers rather than just giving them directly.`;

// ============================================
// CONCEPT MIRROR PROMPTS
// ============================================

const CONCEPT_MIRROR_SYSTEM_PROMPT = `You are Concept Mirror, an AI system designed to analyze and reflect a user's understanding of a concept.
Your purpose is not to teach directly, but to reveal the structure, gaps, and flaws in the user's mental model.
You must prioritize diagnosis over explanation.

CORE OBJECTIVE:
Evaluate a user's explanation of a concept by comparing it against:
- The canonical definition
- Required preconditions and constraints
- Common misconceptions
- Implicit assumptions

OUTPUT RULES:
❌ Do NOT:
- Use complex academic jargon or convoluted sentences
- Rewrite the correct explanation immediately
- Dump textbook definitions
- Say "correct / incorrect" only
- Over-teach or give full solutions

✅ DO:
- Use simple, plain English (ELI15 level)
- Explain *why* something is missing or incorrect clearly
- Point out what the user understands
- Surface what is missing
- Identify what is incorrect
- Detect hidden assumptions
- Highlight confidence mismatches

ANALYSIS GUIDELINES:
- Focus on idea-level comparison, not word matching
- Treat vague language as a signal of uncertainty
- If the user uses confident language around a wrong idea, flag it
- If the explanation is mostly correct but shallow, say so
- If the explanation is fragmented, reflect that fragmentation

TONE & STYLE:
- Clear, simple, and direct
- Conversational but professional
- No judgment, just objective reflection
- No emojis
- No rhetorical questions
- You are a mirror: reflect the user's mental model clearly back to them.

You MUST respond in valid JSON format with this exact structure:
{
  "understood": ["array of things the user clearly understands"],
  "missing": ["array of concepts/details that are missing or incomplete"],
  "incorrect": ["array of statements that are wrong or misleading"],
  "assumptions": ["array of hidden/unstated assumptions detected"],
  "summary": "A paragraph describing the shape of the user's understanding (e.g., surface-level, procedural, intuitive but incomplete, etc.)"
}

Keep each array item concise but informative (1-2 sentences max).
If a category has no items, use an empty array [].
The summary should be 2-4 sentences describing the overall mental model.`;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get API key from environment or localStorage
 */
function getApiKey() {
  return GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
}

/**
 * Set API key in localStorage
 */
export function setApiKey(key) {
  localStorage.setItem('gemini_api_key', key);
}

/**
 * Check if API key is configured
 */
export function hasApiKey() {
  return !!(GEMINI_API_KEY || localStorage.getItem('gemini_api_key'));
}

/**
 * Make API request to Gemini
 */
async function makeGeminiRequest(contents, temperature = 0.7) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textResponse) {
    throw new Error('No response from API');
  }

  return textResponse;
}

// ============================================
// MENTOR MODE API
// ============================================

/**
 * Send a message to the mentor and get a response
 */
export async function sendMentorMessage(messages, topic) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: MENTOR_SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: `I understand. I am an AI Mentor ready to help teach and guide learning about ${topic}. I'll use clear explanations, examples, and interactive teaching methods.` }]
    },
    ...messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  ];

  const apiKey = getApiKey();
  
  if (!apiKey) {
    return getMentorDemoResponse(messages, topic);
  }

  try {
    return await makeGeminiRequest(contents, 0.8);
  } catch (error) {
    console.error('Mentor API error:', error);
    return getMentorDemoResponse(messages, topic);
  }
}

/**
 * Demo response for mentor mode when no API key
 */
function getMentorDemoResponse(messages, topic) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  
  if (messages.length === 1) {
    return `Great choice! Let's explore **${topic}** together. 🎯

I'll guide you through this topic step by step. Here's what we can cover:

**📚 Fundamentals** - Core concepts and definitions
**💡 Examples** - Real-world applications and code samples  
**🧩 Practice** - Exercises to test your understanding
**❓ Q&A** - Any questions you have along the way

Where would you like to start? Feel free to ask me anything about ${topic}, or tell me what aspect you're most interested in!`;
  }

  if (lastMessage.includes('example') || lastMessage.includes('code')) {
    return `Here's a practical example to illustrate the concept:

\`\`\`python
# Example: ${topic}
def example_function():
    """
    This demonstrates the core concept.
    """
    # Step 1: Initialize
    data = prepare_data()
    
    # Step 2: Process
    result = process_data(data)
    
    # Step 3: Return
    return result
\`\`\`

**Key takeaways:**
- Notice how we break it into clear steps
- Each part has a specific purpose
- Error handling would be important in production

Would you like me to explain any part in more detail, or shall we try a practice exercise?`;
  }

  return `That's a great question about ${topic}!

**Here's what you need to know:**

1. **Core Concept** - The fundamental idea behind this is...
2. **How it works** - In practice, this applies when...
3. **Common use cases** - You'll often see this in...

**💡 Pro tip:** The best way to solidify this understanding is through practice.

What aspect would you like to explore further? I can:
- Provide more examples
- Explain the underlying theory
- Give you a practice challenge

Just let me know!`;
}

// ============================================
// CONCEPT MIRROR MODE API
// ============================================

/**
 * Analyze a concept explanation using the Concept Mirror approach
 */
export async function analyzeConceptExplanation(conceptName, userExplanation) {
  const prompt = `Concept Name: ${conceptName}

User's Explanation:
${userExplanation}

Analyze this explanation according to your instructions and respond with the JSON structure.`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: CONCEPT_MIRROR_SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: 'I understand. I will analyze concept explanations and respond with the specified JSON structure, acting as a reflective mirror rather than a teacher.' }]
    },
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ];

  const apiKey = getApiKey();

  if (!apiKey) {
    return getConceptMirrorDemoResponse(conceptName, userExplanation);
  }

  try {
    const response = await makeGeminiRequest(contents, 0.7);
    return parseConceptMirrorResponse(response);
  } catch (error) {
    console.error('Concept Mirror API error:', error);
    return getConceptMirrorDemoResponse(conceptName, userExplanation);
  }
}

/**
 * Parse the AI response to extract JSON
 */
function parseConceptMirrorResponse(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  }

  return {
    understood: ['Unable to parse the analysis response properly'],
    missing: [],
    incorrect: [],
    assumptions: [],
    summary: 'The analysis could not be completed. Please try again.'
  };
}

/**
 * Demo response for concept mirror mode when no API key
 */
function getConceptMirrorDemoResponse(conceptName, explanation) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerExplanation = explanation.toLowerCase();
      const wordCount = explanation.split(/\s+/).length;

      // Pattern detection
      const patterns = {
        hasExamples: /for example|e\.g\.|such as|like when|consider|imagine/i.test(explanation),
        hasEdgeCases: /edge case|corner case|exception|special case|however|but|unless/i.test(explanation),
        isVague: /kind of|sort of|basically|probably|maybe|I think|something like/i.test(explanation),
        isConfident: /always|never|must|definitely|certainly|obviously/i.test(explanation),
        hasTechnicalTerms: /O\(|complexity|algorithm|data structure|time|space|memory/i.test(explanation),
        hasWhy: /because|reason|purpose|in order to|so that/i.test(explanation),
        hasHow: /steps?|first|then|next|process|procedure/i.test(explanation),
      };

      const understood = [];
      const missing = [];
      const incorrect = [];
      const assumptions = [];

      // Build response based on patterns
      if (wordCount > 80) {
        understood.push('The explanation demonstrates substantial engagement with the topic, suggesting active thinking about the concept');
      } else if (wordCount > 40) {
        understood.push('The explanation shows reasonable familiarity with the concept');
      }

      if (patterns.hasExamples) {
        understood.push('Concrete examples were provided, indicating practical understanding beyond abstract definition');
      }

      if (patterns.hasHow) {
        understood.push('A procedural understanding is evident — you describe steps or processes involved');
      }

      if (patterns.hasWhy) {
        understood.push('The explanation addresses the "why" behind the concept, showing deeper reasoning');
      }

      if (!patterns.hasExamples) {
        missing.push('No concrete examples were provided — the explanation remains purely abstract');
      }

      if (!patterns.hasEdgeCases) {
        missing.push('Edge cases, limitations, or boundary conditions were not addressed');
      }

      if (!patterns.hasWhy && patterns.hasHow) {
        missing.push('The explanation describes "how" but not "why" — the underlying motivation is unclear');
      }

      if (patterns.isConfident && wordCount < 40) {
        incorrect.push('Confident assertions appear without sufficient context — this may indicate overconfidence in an incomplete model');
      }

      if (patterns.isVague) {
        assumptions.push('Hedging language ("sort of", "basically") suggests uncertainty about specific details');
      }

      assumptions.push(`Assumption that the fundamental definition of "${conceptName}" is shared between explainer and audience`);

      // Generate summary
      let modelType = '';
      let summaryDetails = '';

      if (wordCount < 30) {
        modelType = 'surface-level';
        summaryDetails = 'The brevity suggests either overconfidence in a simple mental model, or uncertainty about how to elaborate.';
      } else if (patterns.hasHow && patterns.hasWhy && patterns.hasExamples) {
        modelType = 'comprehensive but possibly incomplete';
        summaryDetails = 'The explanation covers multiple dimensions (what, how, why) with examples, though depth may vary.';
      } else if (patterns.hasHow && !patterns.hasWhy) {
        modelType = 'procedural but shallow';
        summaryDetails = 'You can describe the mechanics but may lack understanding of underlying principles.';
      } else {
        modelType = 'partially developed';
        summaryDetails = 'Some aspects are articulated clearly while others remain implicit or unexplored.';
      }

      const summary = `Your understanding of "${conceptName}" appears to be ${modelType}. ${summaryDetails}`;

      resolve({
        understood: understood.length > 0 ? understood : ['Basic familiarity with the concept is evident'],
        missing: missing.slice(0, 4),
        incorrect,
        assumptions: assumptions.slice(0, 3),
        summary
      });
    }, 1500);
  });
}
