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

// Educational question pool across various subjects - targeting teenage audience with engaging, specific questions
const EDUCATIONAL_QUESTIONS = [
  // Science & Biology - Fun & Specific
  "Why do we get brain freeze when eating ice cream too fast?",
  "What happens to your body when you're scared by a horror movie?",
  "How do cats always land on their feet?",
  "Why do onions make you cry when you cut them?",
  "What makes some people allergic to peanuts but not others?",
  "How do energy drinks affect your brain and body?",
  "Why do teenagers need more sleep than adults?",
  "What causes morning breath and how does brushing help?",
  "How do vaccines actually train your immune system?",
  "Why do some people get motion sick on roller coasters?",
  "What makes your stomach growl when you're hungry?",
  "How do painkillers know where the pain is?",
  "Why can't you tickle yourself?",
  "What happens in your brain when you have déjà vu?",

  // History & Wars - Dramatic & Specific
  "What was it really like to live through the London Blitz?",
  "How did teenagers survive during the Great Depression?",
  "What was the most brutal medieval torture device?",
  "How did people react when they first heard about the Titanic sinking?",
  "What was daily life like for a Viking warrior?",
  "How did people communicate during World War II without phones?",
  "What was the deadliest day in human history?",
  "How did the Black Death actually kill people?",
  "What was it like to be a teenager during the Salem Witch Trials?",
  "How did gladiators really fight in ancient Rome?",
  "What was the worst prison in history?",
  "How did people survive the 1906 San Francisco earthquake?",
  "What was it like to witness the first atomic bomb test?",
  "How did pirates really live on their ships?",

  // Physics & Chemistry - Mind-blowing & Relatable
  "Why does time slow down when you're bored?",
  "What would happen if you could run at the speed of light?",
  "How do microwaves actually heat up your food?",
  "Why do mirrors flip things left-to-right but not up-down?",
  "What happens if you drop a penny from the Empire State Building?",
  "How do fireworks create different colors?",
  "Why does hot water freeze faster than cold water sometimes?",
  "What makes glow sticks glow?",
  "How do noise-canceling headphones work?",
  "Why do things look different colors under different lights?",
  "What would happen if gravity suddenly stopped working?",
  "How do smartphones know which way you're holding them?",
  "Why does your voice sound different on recordings?",
  "What makes dry ice so cold and smoky?",

  // Geography & Environment - Extreme & Fascinating
  "What's the most dangerous place on Earth to visit?",
  "How do people survive in Antarctica?",
  "What would happen if all the ice caps melted tomorrow?",
  "Why are some places on Earth hotter than others?",
  "How do hurricanes get their names?",
  "What's at the bottom of the deepest ocean trench?",
  "How do animals know when natural disasters are coming?",
  "What causes those crazy Northern Lights?",
  "Why don't we fall off the Earth if it's spinning?",
  "How do deserts form in the middle of nowhere?",
  "What makes some volcanoes more explosive than others?",
  "How do islands just appear in the ocean?",
  "Why is the Dead Sea so salty you can't sink?",
  "What happens when lightning strikes the ocean?",

  // Technology & Innovation - Modern & Mind-blowing
  "How does your phone know exactly where you are?",
  "What happens to all your deleted photos and messages?",
  "How do video games create such realistic graphics?",
  "Why can't we just download more internet speed?",
  "How do electric cars actually work?",
  "What makes some passwords stronger than others?",
  "How do 3D printers create objects from nothing?",
  "Why do some apps drain your battery faster?",
  "How does Bluetooth know which device to connect to?",
  "What happens inside a computer when it crashes?",
  "How do streaming services know what you want to watch?",
  "Why can't we just make infinite clean energy?",
  "How do robots learn to walk and move?",
  "What makes virtual reality feel so real?",

  // Social Sciences & Psychology - Relatable & Thought-provoking
  "Why do embarrassing memories keep you awake at night?",
  "How do memes spread so fast across the internet?",
  "Why do teenagers and parents argue so much?",
  "What makes some people naturally popular?",
  "How do cults convince people to join them?",
  "Why do people believe in conspiracy theories?",
  "What makes a song get stuck in your head?",
  "How do influencers actually influence people?",
  "Why do people act differently online than in person?",
  "What causes stage fright and performance anxiety?",
  "How do advertisements manipulate what you want to buy?",
  "Why do people choose different friend groups?",
  "What makes some videos go viral while others don't?",
  "How do dictators convince entire countries to follow them?",

  // Pop Culture & Modern Life - Super Engaging
  "How do movie studios create realistic explosions without killing actors?",
  "What happens to your brain when you binge-watch a series?",
  "How do artists make music that gives you chills?",
  "Why do some foods become trendy on social media?",
  "How do special effects make actors look like aliens?",
  "What makes a horror movie actually scary?",
  "How do theme parks design roller coasters that don't kill you?",
  "Why do some fashion trends become popular while others flop?",
  "How do magic tricks fool your brain?",
  "What makes certain colors look good together?",
  "How do video game developers create addictive gameplay?",
  "Why do some celebrities become famous while others don't?",
  "How do makeup artists completely transform actors?",
  "What makes a joke actually funny to different people?"
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
      const [questionSetup, personaData] = await Promise.all([
        openRouterService.generateQuestionSetup(currentQuestion),
        openRouterService.generatePersona(
          selectedTags,
          currentQuestion,
          'educational topic' // Use placeholder since we don't have targetTopic yet
        )
      ])

      console.log(`🎭 Received Persona Data:`, personaData)
      console.log(`📚 Generated Question Setup:`, questionSetup)

      // Update the config with all the generated data
      setConfig({
        question: currentQuestion,
        targetTopic: questionSetup.targetTopic,
        context: questionSetup.context,
        validationCriteria: questionSetup.validationCriteria,
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
            {isGenerating && <div className="spinner"></div>}
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