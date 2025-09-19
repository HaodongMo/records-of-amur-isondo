import axios from 'axios'

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

  setApiKey(key: string) {
    this.apiKey = key
  }

  async generateResponse(
    messages: ChatMessage[],
    model: string = 'deepseek/deepseek-r1-0528'
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key not set')
    }

    try {
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
          }
        }
      )

      return response.data.choices[0]?.message?.content || 'No response generated'
    } catch (error) {
      console.error('OpenRouter API error:', error)
      throw new Error('Failed to generate response from OpenRouter')
    }
  }

  async answerQuestion(
    persona: string,
    question: string,
    context: string = ''
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are ${persona}. Respond to questions from your perspective and knowledge. ${context ? `Context: ${context}` : ''}`
      },
      {
        role: 'user',
        content: question
      }
    ]

    return this.generateResponse(messages)
  }

  async evaluateAnswer(
    question: string,
    answer: string,
    targetTopic: string
  ): Promise<boolean> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an evaluator. Determine if the given answer adequately addresses the question about "${targetTopic}".

        Respond with ONLY "yes" or "no" - nothing else.

        Answer "yes" if the response meaningfully addresses the topic.
        Answer "no" if the response is evasive, off-topic, or doesn't provide substantial information about the topic.`
      },
      {
        role: 'user',
        content: `Question: ${question}\nAnswer: ${answer}\n\nDoes this answer adequately address the question about ${targetTopic}?`
      }
    ]

    try {
      const response = await this.generateResponse(messages)
      const cleanResponse = response.trim().toLowerCase()
      return cleanResponse.includes('yes')
    } catch (error) {
      console.error('Error evaluating answer:', error)
      return false
    }
  }

  async generateFollowUp(
    persona: string,
    question: string,
    previousAnswer: string,
    context: string = ''
  ): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are ${persona}. The human asked you a question and you gave an answer, but it didn't fully address their question.
        Generate a follow-up response that better addresses their original question. ${context ? `Context: ${context}` : ''}`
      },
      {
        role: 'user',
        content: `Original question: ${question}`
      },
      {
        role: 'assistant',
        content: previousAnswer
      },
      {
        role: 'user',
        content: 'Can you elaborate more on the original question? I need a more complete answer.'
      }
    ]

    return this.generateResponse(messages)
  }

  async generateQuestions(
    persona: string,
    context: string,
    chatHistory: ChatMessage[] = [],
    targetTopic: string = ''
  ): Promise<{ id: string; text: string }[]> {
    const historyContext = chatHistory.length > 0
      ? `\n\nChat history:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : ''

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a game designer creating engaging questions for an educational AI game.

        The player is talking to ${persona}.
        ${context ? `Context: ${context}` : ''}
        ${targetTopic ? `The overall topic we're exploring is: ${targetTopic}` : ''}
        ${historyContext}

        Generate exactly 3 diverse, thought-provoking questions that would be interesting to ask this persona.

        Make the questions:
        - Natural and conversational (not just direct topic questions)
        - Varied in approach (personal experience, opinions, explanations, etc.)
        - Engaging and game-like
        - Based on what this persona would know or have experienced
        ${chatHistory.length > 0 ? '- Building on the previous conversation naturally' : ''}

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
        return parsed.map((q, index) => ({
          id: q.id || ['A', 'B', 'C'][index],
          text: q.text || `Question ${index + 1}`
        }))
      }

      throw new Error('Invalid question format received')
    } catch (error) {
      console.error('Error parsing generated questions:', error)
      // Fallback questions
      return [
        { id: 'A', text: 'Tell me about your experience during that time.' },
        { id: 'B', text: 'What was the most significant event you witnessed?' },
        { id: 'C', text: 'How did these events change your perspective?' }
      ]
    }
  }
}

export const openRouterService = new OpenRouterService()
export type { ChatMessage }