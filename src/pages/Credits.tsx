import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/background.webp'
import './Credits.css'

const Credits = () => {
  const navigate = useNavigate()

  return (
    <div className="credits-page">
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
        <div className="credits-header">
          <h1 className="credits-title">Credits</h1>
          <p className="credits-subtitle">The minds behind The Records of Amur Isondo</p>
        </div>

        <div className="team-section">
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3 className="member-name">Haodong Mo</h3>
              <p className="member-role">Lead Programmer, Designer</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👩‍🎨</div>
              <h3 className="member-name">Mikolai Yau</h3>
              <p className="member-role">UI/UX Designer</p>
            </div>

            <div className="team-member">
              <div className="member-avatar">👨‍🏫</div>
              <h3 className="member-name">Wisesa Resosudarmo</h3>
              <p className="member-role">Educational Content Designer</p>
            </div>
          </div>

          <div className="project-info">
            <h3 className="section-title">🎮 About This Project</h3>
            <p className="project-description">
              The Records of Amur Isondo is an educational game that teaches the concept of
              "AI as Simulators" through interactive storytelling and character creation.
              Players explore diverse perspectives by crafting custom AI personas and engaging
              in meaningful conversations across 100 educational topics.
            </p>

            <div className="tech-stack">
              <h4 className="tech-title">Built with:</h4>
              <div className="tech-tags">
                <span className="tech-tag">React</span>
                <span className="tech-tag">TypeScript</span>
                <span className="tech-tag">Zustand</span>
                <span className="tech-tag">OpenRouter API</span>
                <span className="tech-tag">Vite</span>
              </div>
            </div>
          </div>
        </div>

        <div className="navigation-section">
          <button
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Credits