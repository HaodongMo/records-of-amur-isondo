
import { useState, useEffect } from 'react'
import backgroundImage from '../assets/background.webp'
import { useChatStore } from '../store/chatStore'
import './ChatPage.css'

const ChatPage = () => {
  const {
    messages,
    config,
    questionOptions,
    isLoading,
    isGeneratingQuestions,
    hasWon,
    error,
    apiKey,
    sendUserMessage,
    clearMessages,
    setConfig,
    loadApiKeyFromCookie,
    clearApiKey,
    generateInitialQuestions,
    generateFollowUpQuestions
  } = useChatStore()

  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Load API key from cookie and generate initial questions on component mount
  useEffect(() => {
    loadApiKeyFromCookie()
  }, [])

  // Generate initial questions when component mounts (if no questions exist)
  useEffect(() => {
    if (questionOptions.length === 0) {
      generateInitialQuestions()
    }
  }, [questionOptions.length, generateInitialQuestions])

  const handleQuestionSelect = async (optionId: string, questionText: string) => {
    if (isLoading || isGeneratingQuestions) return

    setSelectedOption(optionId)
    await sendUserMessage(questionText)

    // Generate new follow-up questions after the conversation
    setTimeout(() => {
      generateFollowUpQuestions()
    }, 1000) // Small delay to let the conversation complete
  }

  const handleConfigChange = () => {
    const newPersona = prompt('Enter persona:', config.persona)
    const newQuestion = prompt('Enter main question:', config.question)
    const newTopic = prompt('Enter target topic:', config.targetTopic)

    if (newPersona || newQuestion || newTopic) {
      setConfig({
        ...(newPersona && { persona: newPersona }),
        ...(newQuestion && { question: newQuestion }),
        ...(newTopic && { targetTopic: newTopic })
      })
    }
  }

  return (
    <div className="chat-page">
      {/* Background Image */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Black Slanted Texture Bar with Question Title */}
      <div className="texture-overlay">
        {/* Main slanted bar */}
        <div className="slanted-bar" />

        {/* Question title on the slanted bar */}
        <div className="question-title">
          <h1>{config.question}</h1>
        </div>
      </div>

      {/* Floating Back Button */}
      <button className="floating-button back-button">
        ←
      </button>

      {/* Timer */}
      <div className="timer">
        00:00
      </div>

      {/* Character Icons & Settings */}
      <div className="header-icons">
        <div className="character-icons">
          🧞‍♂️ | ⊕
          {apiKey && (
            <span className="status-icon">🔑</span>
          )}
          {hasWon && (
            <span className="trophy-icon">🏆</span>
          )}
        </div>
        <button onClick={handleConfigChange} className="control-button">
          ⚙️ Config
        </button>
        <button onClick={clearMessages} className="control-button">
          🗑️ Clear
        </button>
        <button
          onClick={generateFollowUpQuestions}
          disabled={isGeneratingQuestions || isLoading}
          className="control-button new-questions"
        >
          🎲 New Q's
        </button>
        {apiKey && (
          <button
            onClick={() => {
              if (confirm('Clear saved API key? You will need to re-enter it next time.')) {
                clearApiKey()
              }
            }}
            className="control-button danger"
          >
            🔑 Clear Key
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Character Sprite */}
        <div className="character-sprite">
          <div className="character-sprite-icon">
            🧞‍♂️
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="chat-area">
          {/* Scrollable Messages */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.isUser ? 'user' : 'flame'}`}
              >
                <div className="message-content">
                  {/* Sender Label */}
                  <div className={`message-sender ${message.isUser ? 'user' : 'flame'}`}>
                    {message.sender}
                  </div>

                  {/* Message Box */}
                  <div className={`message-box ${message.isUser ? 'user' : 'flame'}`}>
                    {/* Message Text */}
                    <div className={`message-text ${message.isUser ? 'user' : 'flame'}`}>
                      {message.text}
                    </div>
                  </div>

                  {/* Arrow pointing to character (only for FLAME messages) */}
                  {!message.isUser && (
                    <div className="message-arrow" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Question Options */}
          <div className="question-section">
            <div className="question-content">
              <div className="question-header">
                QUESTION
              </div>

              {/* Error Display */}
              {error && (
                <div className="error-display">
                  Error: {error}
                </div>
              )}

              {/* Loading Indicators */}
              {isLoading && (
                <div className="loading-indicator thinking">
                  🧞‍♂️ Thinking...
                </div>
              )}

              {isGeneratingQuestions && (
                <div className="loading-indicator generating">
                  🎲 Generating new questions...
                </div>
              )}

              <div className="questions-list">
                {questionOptions.length > 0 ? questionOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleQuestionSelect(option.id, option.text)}
                    disabled={isLoading || isGeneratingQuestions}
                    className={`question-button ${selectedOption === option.id ? 'selected' : ''}`}
                  >
                    <div className="question-id">
                      {option.id}
                    </div>
                    <div className="question-text">
                      {option.text}
                    </div>
                  </button>
                )) : !isGeneratingQuestions && (
                  <div className="no-questions">
                    No questions available. Click "🎲 New Q's" to generate some!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage