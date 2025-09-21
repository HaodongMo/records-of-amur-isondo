import axios from 'axios'
import { contentFilter } from '../utils/contentFilter'

interface OpenRouterResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

class OpenRouterService {
  private apiKey: string | null = null
  private baseURL = 'https://openrouter.ai/api/v1/chat/completions'
  private maxRetries = 2
  private baseDelay = 1000 // 1 second base delay

  setApiKey(key: string) {
    this.apiKey = key
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors, timeouts, and certain HTTP status codes
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') return true
    if (error.response?.status >= 500) return true // Server errors
    if (error.response?.status === 429) return true // Rate limiting
    if (error.response?.status === 408) return true // Request timeout
    return false
  }

  async generateResponse(
    messages: ChatMessage[],
    model: string = 'anthropic/claude-sonnet-4'
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key not set')
    }

    let lastError: any

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🤖 OpenRouter API Request [Attempt ${attempt + 1}/${this.maxRetries + 1}]`)
        console.log(`📝 Model: ${model}`)
        console.log(`💬 Messages:`, messages)

        const response = await axios.post<OpenRouterResponse>(
          this.baseURL,
          {
            model,
            messages,
            temperature: 0.7,
            max_tokens: 1000
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Records of Amur Isondo'
            },
            timeout: 30000 // 30 second timeout
          }
        )

        const content = response.data.choices[0]?.message?.content
        if (!content) {
          throw new Error('No content in API response')
        }

        console.log(`✅ OpenRouter API Success [Attempt ${attempt + 1}]`)
        console.log(`📤 Response:`, content)
        return content

      } catch (error) {
        lastError = error
        console.error(`OpenRouter API attempt ${attempt + 1} failed:`, error)

        // Don't retry on the last attempt or if error is not retryable
        if (attempt === this.maxRetries || !this.shouldRetry(error)) {
          break
        }

        // Exponential backoff: 1s, 2s, 4s...
        const delayMs = this.baseDelay * Math.pow(2, attempt)
        console.log(`Retrying in ${delayMs}ms...`)
        await this.delay(delayMs)
      }
    }

    // All retries failed
    console.error('All OpenRouter API retries failed:', lastError)
    throw new Error(`Failed to generate response from OpenRouter after ${this.maxRetries + 1} attempts`)
  }

  async answerQuestion(
    persona: string,
    characterName: string,
    question: string,
    context: string = ''
  ): Promise<string> {
    console.log(`❓ Answering Question for persona: "${persona}"`)
    console.log(`👤 Character Name: "${characterName}"`)
    console.log(`❓ Question: "${question}"`)
    console.log(`📝 Context: "${context}"`)
    const systemPrompt = `You are ${persona}. Your name is ${characterName}. Respond to questions from your perspective and knowledge. You are speaking to a curious young adult, not a peer or expert.

IMPORTANT CONTENT GUIDELINES:
- Keep all responses appropriate for a PG-13 audience
- Avoid profanity, explicit content, or inappropriate material
- Focus on historical, educational, and respectful dialogue
- If asked about sensitive topics, approach them with historical context and maturity
- Maintain the character's voice while keeping content family-friendly
- Set an educational, respectful tone for the conversation
- Don't "roleplay". Speak plainly, without acting out actions or emotions.
- Feel free to be exactly as helpful or unhelpful as you like, within the PG-13 guidelines.
- While you try your best to answer, it's okay to admit if you don't know something.
- Prioritize historical accuracy above all else. If your character would not know something, don't assume they do.
- Many historical characters had limited knowledge of the world beyond their own culture and time period. Avoid anachronisms.
- Characters may not know modern concepts, technology, or events outside their historical context.
- If the question is outside your character's knowledge or time period, they might respond in a variety of ways, such as with confusion, curiosity, anger, or deflection.
- Represent your character's historical perspective accurately. You are ${characterName}, not an AI.
- Be brief. Say only one single sentence or two sentences at most.
- Don't waffle or say too much. Be direct and to the point.

${context ? `Context: ${context}` : ''}`

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: question
      }
    ]

    const response = await this.generateResponse(messages)

    // Filter response for PG-13 content (severity level 2 = PG-13)
    return contentFilter.filterContent(response, 2)
  }

  async evaluateAnswer(
    question: string,
    answer: string,
    targetTopic: string,
    validationCriteria: string[],
    chatHistory?: ChatMessage[]
  ): Promise<boolean> {
    console.log(`🎯 Evaluating Answer for topic: "${targetTopic}"`)
    console.log(`❓ Question: "${question}"`)
    console.log(`💬 Answer: "${answer}"`)
    console.log(`📋 Criteria: ${validationCriteria.length} requirements`)

    const criteriaText = validationCriteria.map((criterion, index) => `${index + 1}. ${criterion}`).join('\n')

    // Format chat history for context if available
    const historyText = chatHistory && chatHistory.length > 0
      ? `\n\nCONVERSATION CONTEXT:\n${chatHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}\n`
      : ''

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an evaluator. Determine if the given answer adequately addresses the question about "${targetTopic}".

        The answer should meet these specific criteria:
        ${criteriaText}

        ${chatHistory && chatHistory.length > 0 ? 'Consider the full conversation context when evaluating. The main research question may have been explored through multiple exchanges.' : ''}

        Respond with ONLY "yes" or "no" - nothing else.

        Answer "yes" if the response meaningfully addresses at least 2-3 of the criteria above, taking into account the full conversation context.
        Answer "no" if the response is evasive, off-topic, or doesn't address the key requirements.`
      },
      {
        role: 'user',
        content: `Question: ${question}\nAnswer: ${answer}${historyText}\n\nDoes this answer adequately address the question about ${targetTopic} based on the criteria and conversation context?`
      }
    ]

    try {
      const response = await this.generateResponse(messages)
      const cleanResponse = response.trim().toLowerCase()
      const result = cleanResponse.includes('yes')
      console.log(`📊 Evaluation Result: ${result ? '✅ ADEQUATE' : '❌ INADEQUATE'}`)
      return result
    } catch (error) {
      console.error('❌ Error evaluating answer:', error)
      return false
    }
  }

  async generateGreeting(
    persona: string,
    characterName: string,
    context: string = ''
  ): Promise<string> {
    console.log(`👋 Generating Greeting for persona: "${persona}"`)
    console.log(`👤 Character Name: "${characterName}"`)
    console.log(`📝 Context: "${context}"`)
    const systemPrompt = `You are ${persona}. Your name is ${characterName}. Generate a brief, welcoming greeting message to start the conversation.

IMPORTANT CONTENT GUIDELINES:
- Keep the greeting appropriate for a PG-13 audience
- Avoid profanity, explicit content, or inappropriate material
- Keep it concise (2-3 sentences max)
- Set an educational, respectful tone for the conversation
- Don't "roleplay". Speak plainly, without acting out actions or emotions.
- Feel free to be exactly as helpful or unhelpful as you like, within the PG-13 guidelines.
- Don't waffle or say too much. Be direct and to the point.
- Many historical characters had limited knowledge of the world beyond their own culture and time period. Avoid anachronisms.
- Characters may not know modern concepts, technology, or events outside their historical context.
- If the question is outside your character's knowledge or time period, they might respond in a variety of ways, such as with confusion, curiosity, anger, or deflection.
- Represent your character's historical perspective accurately. You are ${characterName}, not an AI.

${context ? `Context: ${context}` : ''}`

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: 'Please introduce yourself and welcome me to our conversation.'
      }
    ]

    const response = await this.generateResponse(messages)

    // Filter response for PG-13 content
    return contentFilter.filterContent(response, 2)
  }


  async generatePersona(
    selectedTags: string[],
    _researchQuestion: string,
    _targetTopic: string
  ): Promise<{name: string, description: string}> {
    console.log(`🎭 Generating Persona from tags: ${selectedTags.join(', ')}`)

    const systemPrompt = `You are a helpful assistant that creates historical personas based on given traits.

Create a detailed persona for an AI character based on these selected traits: ${selectedTags.join(', ')}.

IMPORTANT GUIDELINES:
- Keep the persona appropriate for a PG-13 audience
- Make them historically accurate and educational
- Write the description in the format: "a [description] who [background/traits]"
- Be specific and detailed, not generic
- If traits conflict, prioritize historical accuracy
- If you can't create a detailed persona from the traits, make a best-effort guess
- Make sure the persona matches the traits as closely as possible
- If the traits clearly point to a specific historical figure, use that figure
- Think this one through! Give clever combinations of traits full consideration. If there are any interesting or unusual combinations, embrace them.
- Try and think of amusing or unexpected personas that still make sense.

Return your response as valid JSON in this exact format:
{
  "name": "Character Name",
  "description": "a [description] who [background/traits]"
}

Example:
{
  "name": "Khaemwaset",
  "description": "a wise Egyptian priest who served in the temples of Thebes during the reign of Ramesses II and witnessed the construction of great monuments"
}`

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Create a persona from these traits: ${selectedTags.join(', ')}`
      }
    ]

    const response = await this.generateResponse(messages)
    const filteredResponse = contentFilter.filterContent(response, 2)

    try {
      console.log(`🔍 Parsing persona JSON:`, filteredResponse)
      const parsed = JSON.parse(filteredResponse)

      if (!parsed.name || !parsed.description) {
        throw new Error('Invalid persona format - missing name or description')
      }

      console.log(`✨ Generated Persona: ${parsed.name} - ${parsed.description}`)
      return parsed
    } catch (parseError) {
      console.error('❌ Failed to parse persona JSON:', parseError)
      console.log('🔄 Falling back to text parsing')

      // Fallback: try to extract name from description
      const nameMatch = filteredResponse.match(/^(.+?),?\s+(?:a |an |the )/i)
      const fallbackName = nameMatch ? nameMatch[1].trim() : 'Historical Guide'

      return {
        name: fallbackName,
        description: filteredResponse.trim()
      }
    }
  }

  async generateQuestionSetup(
    question: string
  ): Promise<{targetTopic: string, context: string, validationCriteria: string[]}> {
    console.log(`🎯 Generating Question Setup for: "${question}"`)

    const systemPrompt = `You are an educational content specialist. Given a research question, generate comprehensive setup information.

For the question: "${question}"

Generate:
1. A concise target topic (2-4 words) that summarizes what this question is about
2. A brief educational context (1-2 sentences) that provides background for understanding this topic
3. Specific validation criteria (3-5 bullet points) that define what constitutes a good answer to this question

Return your response as valid JSON in this exact format:
{
  "targetTopic": "Brief topic name",
  "context": "Educational background context for this topic",
  "validationCriteria": [
    "Specific requirement 1 for a good answer",
    "Specific requirement 2 for a good answer",
    "Specific requirement 3 for a good answer"
  ]
}

Example:
{
  "targetTopic": "Microbial Biology",
  "context": "This explores the relationship between microorganisms and human health, covering beneficial bacteria, harmful pathogens, and the body's immune responses.",
  "validationCriteria": [
    "Explains the difference between beneficial and harmful microorganisms",
    "Describes how microorganisms interact with the human body",
    "Mentions specific examples of bacteria, viruses, or other microbes",
    "Discusses the role of the immune system in responding to microorganisms"
  ]
}`

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Generate complete setup for: "${question}"`
      }
    ]

    const response = await this.generateResponse(messages)
    const filteredResponse = contentFilter.filterContent(response, 2)

    console.log(`🔍 Parsing question setup JSON:`, filteredResponse)
    const parsed = JSON.parse(filteredResponse)

    if (!parsed.targetTopic || !parsed.context || !parsed.validationCriteria) {
      throw new Error('Invalid setup format - missing targetTopic, context, or validationCriteria')
    }

    console.log(`✨ Generated Setup: Topic="${parsed.targetTopic}", Context="${parsed.context}", Criteria=${parsed.validationCriteria.length} items`)
    return parsed
  }

  async generateQuestions(
    persona: string,
    context: string,
    chatHistory: ChatMessage[] = [],
    targetTopic: string = '',
    researchQuestion: string = ''
  ): Promise<{ id: string; text: string }[]> {
    console.log(`🎲 Generating Questions for persona: "${persona}"`)
    console.log(`🎯 Target Topic: "${targetTopic}"`)
    console.log(`💭 Chat History Length: ${chatHistory.length} messages`)

    // Count user messages (turns) to determine if we should include research question
    const userTurns = chatHistory.filter(msg => msg.role === 'user').length
    const shouldIncludeResearchQuestion = userTurns >= 3 && researchQuestion

    console.log(`🔢 User turns: ${userTurns}, Include research question: ${shouldIncludeResearchQuestion}`)

    const historyContext = chatHistory.length > 0
      ? `\n\nChat history:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : ''

    const researchQuestionGuidance = shouldIncludeResearchQuestion
      ? `\n\nIMPORTANT: The player has been talking for ${userTurns} turns. They need to answer this research question: "${researchQuestion}"\nMake at least one of the questions directly help them answer this research question about ${targetTopic}.`
      : ''

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a young adult interested in learning by talking to a magical spirit guide summoned from history. The guide is ${persona}.
        ${context ? `Context: ${context}` : ''}
        ${historyContext}
        ${researchQuestionGuidance}

        Generate exactly 3 diverse, thought-provoking questions that would be interesting to ask this persona.

        Make the questions:
        - Natural and conversational (not just direct topic questions)
        - Varied in approach (personal experience, opinions, explanations, etc.)
        - Engaging and game-like
        - Based on what this persona would know or have experienced
        - Based on what a child might ask or find interesting
        ${chatHistory.length > 0 ? '- Building on the previous conversation naturally' : ''}
        ${shouldIncludeResearchQuestion ? `- At least one question should guide toward answering: "${researchQuestion}"` : ''}
        - Don't assume any knowledge that hasn't been explicitly mentioned in the chat history
        - Very SHORT - only 1 sentence each

        Respond with a JSON array in this exact format:
        [
          {"id": "A", "text": "question text here"},
          {"id": "B", "text": "question text here"},
          {"id": "C", "text": "question text here"}
        ]`
      },
      {
        role: 'user',
        content: chatHistory.length > 0
          ? 'Generate 3 new follow-up questions based on our conversation so far.'
          : 'Generate 3 initial questions to start our conversation.'
      }
    ]

    try {
      const response = await this.generateResponse(messages)
      const parsed = JSON.parse(response)

      if (Array.isArray(parsed) && parsed.length === 3) {
        const questions = parsed.map((q, index) => ({
          id: q.id || ['A', 'B', 'C'][index],
          text: q.text || `Question ${index + 1}`
        }))
        console.log(`✨ Generated Questions:`, questions)
        return questions
      }

      throw new Error('Invalid question format received')
    } catch (error) {
      console.error('❌ Error parsing generated questions:', error)
      console.log('🔄 Using fallback questions')
      // Fallback questions
      const fallbackQuestions = [
        { id: 'A', text: 'Tell me about your experience during that time.' },
        { id: 'B', text: 'What was the most significant event you witnessed?' },
        { id: 'C', text: 'How did these events change your perspective?' }
      ]
      console.log(`🔄 Fallback Questions:`, fallbackQuestions)
      return fallbackQuestions
    }
  }
}

export const openRouterService = new OpenRouterService()
export type { ChatMessage }