import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import backgroundImage from '../assets/background.webp'
import useGameStore from '../store/gameStore'
import { useChatStore } from '../store/chatStore'
import './Victory.css'

const Victory = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getLevel, getNextLevel } = useGameStore()
  const { resetGameState } = useChatStore()

  // Get level ID from route state
  const state = location.state as { levelId?: string } | null
  const currentLevelId = state?.levelId
  const currentLevel = currentLevelId ? getLevel(currentLevelId) : null
  const nextLevel = currentLevelId ? getNextLevel(currentLevelId) : null

  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleBackToLevels = () => {
    resetGameState()
    navigate('/levels')
  }

  const handleNextLevel = () => {
    if (nextLevel) {
      resetGameState()
      navigate('/persona', { state: { levelId: nextLevel.id } })
    } else {
      // No next level, go back to level selection
      handleBackToLevels()
    }
  }

  const handleContinueChat = () => {
    navigate('/chat')
  }

  if (!currentLevel) {
    // Fallback if no level data
    return (
      <div className="victory">
        <div className="background-image" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className="texture-overlay">
          <div className="slanted-bar" />
        </div>
        <div className="victory-content">
          <h1 className="victory-title">🎉 Victory! 🎉</h1>
          <p className="victory-message">Congratulations on completing your learning journey!</p>
          <button className="victory-button" onClick={handleBackToLevels}>
            Back to Level Selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="victory">
      {/* Background Image */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Texture Overlay */}
      <div className="texture-overlay">
        <div className="slanted-bar" />
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#fbbf24', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'][Math.floor(Math.random() * 5)]
            }} />
          ))}
        </div>
      )}

      {/* Victory Content */}
      <div className="victory-content">
        <div className="victory-header">
          <h1 className="victory-title">🎉 Level Complete! 🎉</h1>
          <div className="completed-level">
            <span className="level-number">Level {currentLevel.title}</span>
            <span className="level-name">{currentLevel.description}</span>
          </div>
        </div>

        <div className="victory-message">
          <p>You've successfully mastered:</p>
          <div className="topic-highlight">
            {currentLevel.targetTopic}
          </div>
        </div>

        <div className="victory-actions">
          <button
            className="victory-button continue-chat"
            onClick={handleContinueChat}
          >
            Continue Conversation
          </button>

          <div className="navigation-buttons">
            <button
              className="victory-button back-to-levels"
              onClick={handleBackToLevels}
            >
              ← Level Selection
            </button>

            {nextLevel ? (
              <button
                className="victory-button next-level"
                onClick={handleNextLevel}
              >
                Next Level: {nextLevel.title} →
              </button>
            ) : (
              <div className="completion-message">
                🏆 All levels completed! You've mastered the Records of Amur Isondo!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Victory