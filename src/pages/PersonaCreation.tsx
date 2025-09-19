import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import backgroundImage from '../assets/background.webp'
import { useChatStore } from '../store/chatStore'
import { openRouterService } from '../lib/openrouter'
import './PersonaCreation.css'

// Comprehensive categorized tag system for persona creation
const PERSONA_TAG_CATEGORIES = {
  timePeriods: [
    'Stone Age', 'Bronze Age', 'Iron Age', 'Classical Antiquity', 'Ancient Period',
    'Medieval Era', 'Dark Ages', 'Renaissance', 'Baroque Period', 'Enlightenment',
    'Industrial Revolution', '1800s', '1850s', '1900s', '1920s', '1940s', '1960s', '1980s', '1990s',
    'Victorian Era', 'Edwardian Era', 'Belle Époque', 'Gilded Age', 'Jazz Age',
    'Cold War Era', 'Information Age', 'Modern Era', 'Contemporary', 'Present Day',
    'Pre-Columbian', 'Colonial Period', 'Post-War Era', 'Space Age', 'Digital Age'
  ],

  professions: [
    'Warrior', 'Scholar', 'Merchant', 'Artisan', 'Blacksmith', 'Farmer', 'Hunter', 'Fisher',
    'Scribe', 'Librarian', 'Teacher', 'Healer', 'Doctor', 'Herbalist', 'Midwife',
    'Sailor', 'Captain', 'Explorer', 'Navigator', 'Cartographer', 'Trader', 'Diplomat',
    'Spy', 'Guard', 'Knight', 'Samurai', 'General', 'Admiral', 'Soldier',
    'Artist', 'Painter', 'Sculptor', 'Musician', 'Bard', 'Storyteller', 'Poet',
    'Inventor', 'Engineer', 'Architect', 'Builder', 'Mason', 'Carpenter',
    'Baker', 'Brewer', 'Cook', 'Tailor', 'Weaver', 'Potter', 'Jeweler',
    'Scientist', 'Researcher', 'Biologist', 'Botanist', 'Microbiologist', 'Chemist',
    'Physicist', 'Astronomer', 'Geologist', 'Anthropologist', 'Archaeologist',
    'Historian', 'Journalist', 'Photographer', 'Naturalist', 'Field Worker'
  ],

  culturalOrigins: [
    'Celtic', 'Germanic', 'Nordic', 'Slavic', 'Byzantine', 'Frankish', 'Saxon',
    'Egyptian', 'Nubian', 'Ethiopian', 'Berber', 'Moorish',
    'Greek', 'Roman', 'Etruscan', 'Phoenician', 'Carthaginian',
    'Persian', 'Mesopotamian', 'Babylonian', 'Sumerian', 'Assyrian',
    'Chinese', 'Japanese', 'Korean', 'Mongol', 'Tibetan', 'Indian', 'Tamil',
    'Arabic', 'Turkish', 'Kurdish', 'Afghan', 'Kazakh',
    'Aztec', 'Mayan', 'Incan', 'Cherokee', 'Iroquois', 'Lakota', 'Inuit',
    'Aboriginal', 'Maori', 'Polynesian', 'Hawaiian', 'Samoan',
    'Rus', 'Cossack', 'Tartar', 'Scythian', 'Hun', 'Visigoth'
  ],

  socialClasses: [
    'Peasant', 'Commoner', 'Citizen', 'Freeman', 'Serf', 'Slave',
    'Merchant Class', 'Artisan Class', 'Middle Class', 'Bourgeois',
    'Noble', 'Aristocrat', 'Patrician', 'Gentry', 'Courtier',
    'Royalty', 'Emperor', 'King', 'Queen', 'Prince', 'Princess',
    'Duke', 'Duchess', 'Earl', 'Count', 'Baron', 'Lord', 'Lady',
    'Chieftain', 'Tribal Leader', 'Elder', 'Clan Head',
    'Outcast', 'Exile', 'Refugee', 'Nomad', 'Wanderer'
  ],

  personalityTraits: [
    'Wise', 'Cunning', 'Brave', 'Cowardly', 'Honest', 'Deceitful',
    'Loyal', 'Treacherous', 'Ambitious', 'Humble', 'Proud', 'Modest',
    'Compassionate', 'Ruthless', 'Kind', 'Cruel', 'Generous', 'Greedy',
    'Patient', 'Impulsive', 'Calm', 'Hot-tempered', 'Peaceful', 'Aggressive',
    'Optimistic', 'Pessimistic', 'Cheerful', 'Melancholic', 'Serious', 'Playful',
    'Scholarly', 'Practical', 'Idealistic', 'Pragmatic', 'Romantic', 'Cynical',
    'Charismatic', 'Shy', 'Confident', 'Insecure', 'Stubborn', 'Flexible'
  ],

  everydayAnimals: [
    'Cat', 'Dog', 'Horse', 'Cow', 'Pig', 'Goat', 'Sheep', 'Chicken', 'Duck', 'Goose',
    'Rabbit', 'Mouse', 'Rat', 'Bird', 'Crow', 'Eagle', 'Hawk', 'Owl', 'Sparrow',
    'Fish', 'Salmon', 'Trout', 'Whale', 'Dolphin', 'Seal', 'Bear', 'Wolf', 'Fox',
    'Deer', 'Elk', 'Moose', 'Buffalo', 'Elephant', 'Lion', 'Tiger', 'Leopard',
    'Monkey', 'Ape', 'Snake', 'Lizard', 'Turtle', 'Frog', 'Bee', 'Ant', 'Spider'
  ],

  everydayObjects: [
    'Book', 'Scroll', 'Letter', 'Map', 'Compass', 'Clock', 'Bell', 'Mirror',
    'Candle', 'Lamp', 'Fire', 'Stone', 'Rock', 'Pebble', 'Sand', 'Clay',
    'Wood', 'Tree', 'Flower', 'Seed', 'Fruit', 'Grain', 'Bread', 'Water',
    'Well', 'River', 'Lake', 'Mountain', 'Hill', 'Valley', 'Field', 'Garden',
    'House', 'Hut', 'Barn', 'Mill', 'Bridge', 'Road', 'Path', 'Gate',
    'Wagon', 'Cart', 'Boat', 'Ship', 'Sword', 'Shield', 'Spear', 'Bow',
    'Tool', 'Hammer', 'Axe', 'Knife', 'Pot', 'Jar', 'Basket', 'Rope'
  ],

  limitedMystical: [
    'Spirit', 'Ancestor Spirit', 'Guardian Spirit', 'Oracle', 'Prophet', 'Seer',
    'Shaman', 'Wise Woman', 'Healer', 'Witch Doctor', 'Medicine Man',
    'Dragon', 'Phoenix', 'Sphinx', 'God', 'Goddess', 'Deity'
  ],

  learningSkills: [
    'Student', 'Teacher', 'Apprentice', 'Master', 'Tutor', 'Mentor', 'Guide',
    'Reader', 'Writer', 'Storyteller', 'Translator', 'Interpreter', 'Messenger',
    'Curious', 'Observant', 'Analytical', 'Creative', 'Logical', 'Intuitive',
    'Quick Learner', 'Slow Learner', 'Memory Keeper', 'Record Keeper',
    'Mathematician', 'Calculator', 'Counter', 'Measurer', 'Surveyor',
    'Thinker', 'Questioner', 'Doubter', 'Believer', 'Skeptic', 'Dreamer',
    'Problem Solver', 'Puzzle Maker', 'Game Player', 'Rule Follower', 'Rule Breaker'
  ]
}

// Educational question pool across various subjects
const EDUCATIONAL_QUESTIONS = [
  // Science & Biology
  "How do microorganisms affect human health and disease?",
  "What role do plants play in Earth's ecosystem?",
  "How do genetic mutations drive evolution?",
  "What causes different blood types in humans?",
  "How do vaccines work to prevent disease?",
  "What happens during photosynthesis?",
  "How do antibiotics fight bacterial infections?",
  "What makes viruses different from bacteria?",

  // History & Wars
  "Who was responsible for starting World War I?",
  "What were the main causes of World War II?",
  "How did the Black Death change European society?",
  "What led to the fall of the Roman Empire?",
  "Why did the American Civil War begin?",
  "What caused the French Revolution?",
  "How did the Industrial Revolution change daily life?",
  "What were the consequences of European colonization?",

  // Physics & Chemistry
  "How does gravity work?",
  "What makes atoms stick together?",
  "Why do some materials conduct electricity?",
  "How do magnets create magnetic fields?",
  "What causes different states of matter?",
  "How does nuclear energy work?",
  "What makes light behave like both a wave and particle?",
  "How do chemical reactions occur?",

  // Geography & Environment
  "What causes climate change?",
  "How do mountains form?",
  "Why do earthquakes happen?",
  "What creates ocean currents?",
  "How do rivers shape landscapes?",
  "What causes different weather patterns?",
  "How do ecosystems maintain balance?",
  "What factors determine regional climates?",

  // Technology & Innovation
  "How did the printing press change society?",
  "What led to the development of computers?",
  "How do airplanes stay in the air?",
  "What makes the internet work?",
  "How did electricity transform civilization?",
  "What drove the space race?",
  "How do modern communications work?",
  "What innovations shaped the modern world?",

  // Social Sciences
  "How do languages develop and change?",
  "What creates cultural differences between societies?",
  "How do economic systems work?",
  "What factors influence human behavior?",
  "How do societies organize themselves?",
  "What role does education play in civilization?",
  "How do laws and governments develop?",
  "What drives human migration patterns?"
]

// Function to get balanced selection from all categories
const getBalancedRandomTags = (totalCount: number = 20): string[] => {
  const categories = Object.values(PERSONA_TAG_CATEGORIES)
  const tagsPerCategory = Math.floor(totalCount / categories.length)
  const remainder = totalCount % categories.length

  let selectedTags: string[] = []

  categories.forEach((categoryTags, index) => {
    // Add extra tag to first 'remainder' categories to distribute remainder evenly
    const countForThisCategory = tagsPerCategory + (index < remainder ? 1 : 0)

    // Shuffle and take required count from this category
    const shuffled = [...categoryTags].sort(() => 0.5 - Math.random())
    selectedTags.push(...shuffled.slice(0, Math.min(countForThisCategory, shuffled.length)))
  })

  // Final shuffle of the selected tags
  return selectedTags.sort(() => 0.5 - Math.random())
}

// Function to select random question
const getRandomQuestion = (): string => {
  const randomIndex = Math.floor(Math.random() * EDUCATIONAL_QUESTIONS.length)
  return EDUCATIONAL_QUESTIONS[randomIndex]
}

const PersonaCreation = () => {
  const navigate = useNavigate()
  const { config, setConfig, setCharacterName, loadApiKeyFromCookie } = useChatStore()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [displayTags, setDisplayTags] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const MAX_TAGS = 5

  // Load API key, generate balanced random tags, and select random question on mount
  useEffect(() => {
    loadApiKeyFromCookie()
    setDisplayTags(getBalancedRandomTags(20)) // Show 20 balanced random tags

    const randomQuestion = getRandomQuestion()
    setCurrentQuestion(randomQuestion)
    console.log(`🎲 Selected random question: "${randomQuestion}"`)
  }, [loadApiKeyFromCookie])

  const rerollQuestion = () => {
    const newQuestion = getRandomQuestion()
    setCurrentQuestion(newQuestion)
    console.log(`🎲 Rerolled to new question: "${newQuestion}"`)
  }

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // Remove tag if already selected
        return prev.filter(t => t !== tag)
      } else if (prev.length < MAX_TAGS) {
        // Add tag if under limit
        return [...prev, tag]
      } else {
        // At limit, show error
        setError(`Maximum ${MAX_TAGS} tags allowed. Remove a tag first.`)
        setTimeout(() => setError(null), 3000)
        return prev
      }
    })
  }

  const refreshTags = () => {
    setDisplayTags(getBalancedRandomTags(20))
    console.log('🎲 Refreshed tags with balanced selection')
  }

  const generatePersona = async () => {
    if (selectedTags.length === 0) {
      setError('Please select at least one tag to create your persona')
      return
    }

    if (!currentQuestion) {
      setError('No question selected. Please refresh the page.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Get or prompt for API key
      const chatStore = useChatStore.getState()
      if (!chatStore.apiKey) {
        await chatStore.initializeApiKey()
      }

      // Generate context and persona concurrently to save time
      console.log(`📚 Generating context and persona concurrently for question: "${currentQuestion}"`)
      const [questionContext, personaData] = await Promise.all([
        openRouterService.generateQuestionContext(currentQuestion),
        openRouterService.generatePersona(
          selectedTags,
          currentQuestion,
          'educational topic' // Use placeholder since we don't have targetTopic yet
        )
      ])

      console.log(`🎭 Received Persona Data:`, personaData)
      console.log(`📚 Generated Question Context:`, questionContext)

      // Update the config with all the generated data
      setConfig({
        question: currentQuestion,
        targetTopic: questionContext.targetTopic,
        context: questionContext.context,
        persona: personaData.description.trim()
      })
      setCharacterName(personaData.name)

      // Navigate to chat page
      navigate('/chat')

    } catch (err) {
      console.error('Error generating persona:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate persona')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="persona-creation">
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
        <div className="persona-header">
          <h1 className="page-title">Create Your Historical Guide</h1>
          <div className="research-question">
            <h2>Research Question:</h2>
            <p>"{currentQuestion || 'Loading question...'}"</p>
            <button className="reroll-question-btn" onClick={rerollQuestion}>
              🎲 New Question
            </button>
          </div>
          <p className="instructions">
            Select up to {MAX_TAGS} traits from the floating tags to create your guide.
          </p>
        </div>

        {/* Selected Tags Display */}
        <div className="selected-tags-area">
          <h3>Selected Traits: ({selectedTags.length}/{MAX_TAGS})</h3>
          <div className="selected-tags">
            {selectedTags.length === 0 ? (
              <span className="no-tags">No traits selected yet...</span>
            ) : (
              selectedTags.map(tag => (
                <span
                  key={tag}
                  className="selected-tag"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag} ×
                </span>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <button className="refresh-button" onClick={refreshTags}>
            🎲 Reroll Tags
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Continue Button */}
        <div className="continue-section">
          <button
            className="continue-button"
            onClick={generatePersona}
            disabled={isGenerating || selectedTags.length === 0}
          >
            {isGenerating ? 'Creating Your Guide...' : 'Continue to Chat'}
          </button>
        </div>
      </div>

      {/* Floating Tags Around the Edges */}
      <div className="floating-tags-container">
        {displayTags.map((tag, index) => {
          // Calculate position around the edges of the screen
          const angle = (index / displayTags.length) * 2 * Math.PI
          const radius = 45 // percentage from center
          const centerX = 50
          const centerY = 50
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          return (
            <button
              key={tag}
              className={`floating-tag ${selectedTags.includes(tag) ? 'selected' : ''} ${selectedTags.length >= MAX_TAGS && !selectedTags.includes(tag) ? 'disabled' : ''}`}
              style={{
                animationDelay: `${index * 0.1}s`,
                left: `${Math.max(2, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(90, y))}%`
              }}
              onClick={() => handleTagClick(tag)}
              disabled={selectedTags.length >= MAX_TAGS && !selectedTags.includes(tag)}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PersonaCreation