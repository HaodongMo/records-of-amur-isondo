import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/background.webp'
import useGameStore from '../store/gameStore'
import { GameLevel } from '../types'
import './LevelSelection.css'

const LevelSelection = () => {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null)

  const {
    levels,
    isLevelUnlocked,
    isLevelCompleted,
    setCurrentLevel
  } = useGameStore()

  const handleLevelClick = (level: GameLevel) => {
    if (!isLevelUnlocked(level.id)) {
      return
    }
    setSelectedLevel(level)
  }

  const handleStartLevel = () => {
    if (!selectedLevel) return

    setCurrentLevel(selectedLevel.id)
    navigate('/persona', { state: { levelId: selectedLevel.id } })
  }

  const getDifficultyColor = (difficulty: GameLevel['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return '#22c55e'
      case 'intermediate':
        return '#fbbf24'
      case 'advanced':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getCategoryIcon = (category: GameLevel['category']) => {
    switch (category) {
      case 'introduction':
        return '🌟'
      case 'philosophy':
        return '🤔'
      case 'science':
        return '🔬'
      case 'technology':
        return '💻'
      case 'literature':
        return '📚'
      case 'history':
        return '📜'
      default:
        return '❓'
    }
  }

  return (
    <div className="level-selection">
      {/* Background Image */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Texture Overlay */}
      <div className="texture-overlay">
        <div className="slanted-bar" />
      </div>

      {/* Back Button */}
      <button
        className="floating-button back-button"
        onClick={() => navigate('/')}
      >
        ← Home
      </button>

      {/* Main Content */}
      <div className="main-layout">
        {/* Left Panel - Level Grid */}
        <div className="level-panel">
          <div className="level-header">
            <h1 className="page-title">Select Your Journey</h1>
            <p className="instructions">
              Choose a level to begin your exploration of knowledge
            </p>
          </div>

          <div className="level-grid-container">
            <div className="level-grid">
              {levels.map((level, index) => {
                const isUnlocked = isLevelUnlocked(level.id)
                const isCompleted = isLevelCompleted(level.id)
                const isSelected = selectedLevel?.id === level.id

                return (
                  <button
                    key={level.id}
                    className={`level-number ${
                      isUnlocked ? 'unlocked' : 'locked'
                    } ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleLevelClick(level)}
                    disabled={!isUnlocked}
                  >
                    <span className="number">{index + 1}</span>
                    {isCompleted && <span className="completed-indicator">✓</span>}
                    {!isUnlocked && <span className="locked-indicator">🔒</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Level Details */}
        <div className="details-panel">
          {selectedLevel ? (
            <div className="level-details">
              <div className="level-info">
                <div className="level-meta">
                  <span className="category-icon">{getCategoryIcon(selectedLevel.category)}</span>
                  <span
                    className="difficulty-badge"
                    style={{ color: getDifficultyColor(selectedLevel.difficulty) }}
                  >
                    {selectedLevel.difficulty.toUpperCase()}
                  </span>
                </div>

                <h2 className="level-title">{selectedLevel.title}</h2>
                <p className="level-description">{selectedLevel.description}</p>

                <div className="research-question">
                  <h3>Research Question</h3>
                  <p>"{selectedLevel.question}"</p>
                </div>

                <div className="persona-preview">
                  <h3>Tag Selection Tips</h3>
                  <div className="tips-list">
                    <p>• Mix different time periods with relevant professions</p>
                    <p>• Choose cultural origins that match your topic</p>
                    <p>• Add personality traits for unique perspectives</p>
                    <p>• Consider what expertise would be most helpful</p>
                  </div>
                </div>
              </div>

              <div className="level-actions">
                <button
                  className="continue-button"
                  onClick={handleStartLevel}
                >
                  Begin Journey
                </button>
              </div>
            </div>
          ) : (
            <div className="selection-prompt">
              <p className="prompt-text">
                Click on a level number to see details and begin your journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LevelSelection