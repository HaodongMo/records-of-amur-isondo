import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/background.webp'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      {/* Background Image */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Texture Overlay */}
      <div className="texture-overlay">
        <div className="slanted-bar" />
      </div>

      {/* Central Content Area */}
      <div className="central-content">
        <div className="game-header">
          <h1 className="game-title">The Records of Amur Isondo</h1>
          <p className="game-subtitle">A magical artifact that possesses the combined knowledge of all mankind</p>
        </div>

        <div className="welcome-content">
          <div className="welcome-text">
            <h2 className="section-title">🧞‍♂️ Welcome, Seeker of Knowledge</h2>
            <p className="description">
              Embark on an educational journey where you'll discover the secrets of AI as simulators.
              Use the mystical Records to summon different guide spirits, each with their own expertise,
              cultural background, and unique perspective on the questions you seek to answer.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🎭</span>
                <span className="feature-text">Create custom AI personas through tag selection</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌟</span>
                <span className="feature-text">Explore diverse perspectives on complex topics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span className="feature-text">Learn through interactive conversations</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span className="feature-text">Master the concept of latent space steering</span>
              </div>
            </div>
          </div>

          <div className="start-section">
            <button
              onClick={() => navigate('/levels')}
              className="start-button"
            >
              🚀 Begin Your Journey
            </button>
            <p className="start-hint">
              Choose from 30 progressively challenging levels designed to teach you about AI, technology, philosophy, and more!
            </p>
          </div>
        </div>
      </div>

      {/* Credits Link */}
      <div className="credits-link-section">
        <button
          onClick={() => navigate('/credits')}
          className="credits-link"
        >
          Credits
        </button>
      </div>
    </div>
  )
}

export default HomePage