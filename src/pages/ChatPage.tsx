
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/background.webp'
import { useChatStore } from '../store/chatStore'
import useGameStore from '../store/gameStore'
import './ChatPage.css'

const ChatPage = () => {
  const navigate = useNavigate()
  const {
    messages,
    config,
    questionOptions,
    isLoading,
    isGeneratingQuestions,
    isInitializing,
    hasWon,
    error,
    apiKey,
    characterName,
    hasCustomPersona,
    currentLevelId,
    sendUserMessage,
    clearMessages,
    resetGameState,
    setConfig,
    loadApiKeyFromCookie,
    clearApiKey,
    generateFollowUpQuestions,
    initializeChat,
    undoLastTurn
  } = useChatStore()

  const { getLevel, levels, hasUndoAbility, completedLevels, getNextLevel } = useGameStore()

  // Get current level info if we're in level mode
  const currentLevel = currentLevelId ? getLevel(currentLevelId) : null
  const currentLevelNumber = currentLevel ? levels.findIndex(level => level.id === currentLevel.id) + 1 : null

  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showPersonaSuggestionModal, setShowPersonaSuggestionModal] = useState(false)

  // Check if user has a custom persona, redirect to creation if not
  useEffect(() => {
    if (!hasCustomPersona) {
      console.log('No custom persona found, redirecting to persona creation')
      navigate('/persona')
      return
    }
  }, [hasCustomPersona, navigate])

  // Load API key from cookie and generate initial questions on component mount
  useEffect(() => {
    loadApiKeyFromCookie()
  }, [])

  // Initialize chat when component mounts (only if we have a custom persona)
  useEffect(() => {
    if (hasCustomPersona) {
      initializeChat()
    }
  }, [hasCustomPersona])

  // Victory is now handled in-chat instead of redirecting to victory screen

  // Show persona suggestion modal after 10 messages (but only if not won yet)
  useEffect(() => {
    const suggestionShown = localStorage.getItem('personaSuggestionShown')
    if (!hasWon && !suggestionShown && messages.length >= 10) {
      setShowPersonaSuggestionModal(true)
      localStorage.setItem('personaSuggestionShown', 'true')
    }
  }, [messages.length, hasWon])

  const handleQuestionSelect = async (optionId: string, questionText: string) => {
    if (isLoading || isGeneratingQuestions) return

    setSelectedOption(optionId)
    await sendUserMessage(questionText)

    // Clear selection after message is sent (new questions will be generated automatically)
    setSelectedOption(null)
  }

  const handleBackToPersonaCreation = () => {
    // Reset chat state but keep the level ID to go back to persona creation for the same level
    resetGameState()
    if (currentLevelId) {
      navigate('/persona', { state: { levelId: currentLevelId } })
    } else {
      navigate('/levels')
    }
  }

  const handleGenerateNewQuestions = () => {
    // Clear selected option when generating new questions
    setSelectedOption(null)
    generateFollowUpQuestions()
  }

  const handleUndo = async () => {
    if (messages.length <= 1) {
      alert('No conversation turns to undo!')
      return
    }

    // Clear selected option when undoing
    setSelectedOption(null)
    await undoLastTurn()
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

  const handleDebugMessage = async () => {
    const customMessage = prompt('Enter custom message to send:')
    if (customMessage && customMessage.trim()) {
      await sendUserMessage(customMessage.trim())
    }
  }

  const handleClosePersonaSuggestionModal = () => {
    setShowPersonaSuggestionModal(false)
  }

  const handleTryNewPersona = () => {
    setShowPersonaSuggestionModal(false)
    handleBackToPersonaCreation()
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
      <button
        className="floating-button back-button"
        onClick={handleBackToPersonaCreation}
      >
← New Persona
      </button>

      {/* Debug Button */}
      <button
        className="debug-button"
        onClick={handleDebugMessage}
        title="Debug: Send custom message"
      >
        MSG
      </button>

      {/* Floating Continue Button (appears when player wins) */}
      {hasWon && currentLevelId && (
        <button
          className="floating-continue-button"
          onClick={() => {
            const nextLevel = getNextLevel(currentLevelId)
            resetGameState()
            if (nextLevel) {
              navigate('/persona', { state: { levelId: nextLevel.id } })
            } else {
              navigate('/levels')
            }
          }}
        >
          {getNextLevel(currentLevelId) ? `Next Level →` : 'Level Selection'}
        </button>
      )}

      {/* Character Icons & Settings */}
      <div className="header-icons">
        <div className="character-icons">
          {currentLevelNumber && (
            <span className="level-indicator">Level {currentLevelNumber}</span>
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
          onClick={handleGenerateNewQuestions}
          disabled={isGeneratingQuestions || isLoading}
          className="control-button new-questions"
        >
          🎲 New Q's
        </button>
        {hasUndoAbility && (
          <button
            onClick={handleUndo}
            disabled={isGeneratingQuestions || isLoading || messages.length <= 1}
            className="control-button undo"
          >
            ↶ Undo
          </button>
        )}
        <button
          onClick={() => {
            resetGameState()
            navigate('/levels')
          }}
          className="control-button levels"
        >
          📚 Levels
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
                    {message.isUser ? 'USER' : characterName.toUpperCase()}
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
                {hasWon ? 'VICTORY!' : 'QUESTION'}
              </div>

              {/* Error Display */}
              {error && (
                <div className="error-display">
                  Error: {error}
                </div>
              )}

              {/* Victory Display */}
              {hasWon ? (
                <div className="loading-indicator victory">
                  <div className="victory-content">
                    <div className="victory-text">
                      🎉 Congratulations! You've mastered <strong>{config.targetTopic}</strong>!
                      {completedLevels.length === 5 && hasUndoAbility && (
                        <div className="unlock-note">
                          🎊 New Ability Unlocked: Undo button! 🎊
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateNewQuestions}
                      disabled={isGeneratingQuestions || isLoading}
                      className="victory-continue-button"
                    >
                      Continue Conversation
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Unified Loading Indicator */}
                  {(isLoading || isInitializing || isGeneratingQuestions) ? (
                    <div className="loading-indicator unified">
                      <div className="loading-content">
                        <div className="throbber"></div>
                        <div className="loading-text">
                          {isInitializing
                            ? "🧞‍♂️ Summoning your guide and preparing questions..."
                            : isGeneratingQuestions
                            ? "🎲 Generating new questions..."
                            : "🧞‍♂️ Thinking..."
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="questions-list">
                      {questionOptions.length > 0 ? questionOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleQuestionSelect(option.id, option.text)}
                          disabled={isLoading || isGeneratingQuestions || isInitializing}
                          className={`question-button ${selectedOption === option.id ? 'selected' : ''}`}
                        >
                          <div className="question-id">
                            {option.id}
                          </div>
                          <div className="question-text">
                            {option.text}
                          </div>
                        </button>
                      )) : (
                        <div className="no-questions">
                          No questions available. Click "🎲 New Q's" to generate some!
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Persona Suggestion Modal */}
      {showPersonaSuggestionModal && (
        <div className="modal-overlay" onClick={handleClosePersonaSuggestionModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🤔 Having Trouble Finding What You Need?</h2>
            </div>
            <div className="modal-body">
              <div className="suggestion-explanation">
                <h3>💡 Different Persona, Different Perspective</h3>
                <p>
                  You've been chatting for a while! Sometimes a different guide persona can offer
                  fresh insights and help you discover new angles on your research question.
                </p>
                <p>
                  Each persona brings their own expertise, cultural background, and perspective.
                  A medieval scholar might approach your question very differently than a modern scientist!
                </p>
              </div>

              <div className="suggestion-actions">
                <h3>🎭 Try a New Approach</h3>
                <p>
                  Would you like to create a different persona and see how they tackle this same question?
                  Your progress is saved, so you can always come back to this conversation later.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-action-button continue" onClick={handleClosePersonaSuggestionModal}>
                Continue with Current Guide
              </button>
              <button className="modal-action-button try-new" onClick={handleTryNewPersona}>
                🎲 Try a New Persona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage