import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LevelSelection from './pages/LevelSelection'
import PersonaCreation from './pages/PersonaCreation'
import ChatPage from './pages/ChatPage'
import Victory from './pages/Victory'
import Credits from './pages/Credits'

function App() {
  // Use basename for GitHub Pages deployment (production), but not for local development
  const basename = import.meta.env.PROD ? '/records-of-amur-isondo' : ''

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/levels" element={<LevelSelection />} />
          <Route path="/persona" element={<PersonaCreation />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/victory" element={<Victory />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App