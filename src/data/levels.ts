import { GameLevel } from '../types'

// Educational game levels designed for children ages 8-16
// Questions progress from simple concepts to more complex thinking
export const GAME_LEVELS: GameLevel[] = [
  // Beginner Levels (1-20) - Basic concepts and curiosity
  {
    id: 'intro',
    title: 'What is AI?',
    description: 'Meet your first AI spirit and learn what artificial intelligence means',
    question: 'What is artificial intelligence and how does it help people?',
    targetTopic: 'artificial intelligence basics',
    difficulty: 'beginner',
    category: 'introduction'
  },
  {
    id: 'asking-questions',
    title: 'The Power of Questions',
    description: 'Learn why asking good questions helps us learn better',
    question: 'Why is asking questions important for learning new things?',
    targetTopic: 'curiosity and inquiry',
    difficulty: 'beginner',
    category: 'philosophy',
    unlockAfter: 'intro'
  },
  {
    id: 'ancient-inventions',
    title: 'Cool Ancient Inventions',
    description: 'Discover amazing things people invented long ago',
    question: 'What were some of the coolest inventions from ancient times?',
    targetTopic: 'ancient technology and innovation',
    difficulty: 'beginner',
    category: 'history',
    unlockAfter: 'asking-questions'
  },
  {
    id: 'how-we-learn',
    title: 'How Our Brains Learn',
    description: 'Find out how your amazing brain learns new things',
    question: 'How does our brain learn and remember new information?',
    targetTopic: 'learning and memory',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'ancient-inventions'
  },
  {
    id: 'animal-friends',
    title: 'Amazing Animal Friends',
    description: 'Learn about incredible animals and their special abilities',
    question: 'What are some amazing things animals can do that humans cannot?',
    targetTopic: 'animal adaptations and abilities',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'how-we-learn'
  },
  {
    id: 'storytelling',
    title: 'The Magic of Stories',
    description: 'Explore why humans love telling and hearing stories',
    question: 'Why do people love stories and how do they help us learn?',
    targetTopic: 'storytelling and human culture',
    difficulty: 'beginner',
    category: 'literature',
    unlockAfter: 'animal-friends'
  },
  {
    id: 'simple-machines',
    title: 'Simple Machines Around Us',
    description: 'Discover the simple machines that make our lives easier',
    question: 'What are simple machines and how do they help us do work?',
    targetTopic: 'simple machines and physics',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'storytelling'
  },
  {
    id: 'being-kind',
    title: 'Why Kindness Matters',
    description: 'Think about why being kind to others is important',
    question: 'Why is it important to be kind to other people and animals?',
    targetTopic: 'empathy and moral reasoning',
    difficulty: 'beginner',
    category: 'philosophy',
    unlockAfter: 'simple-machines'
  },
  {
    id: 'water-cycle',
    title: 'The Amazing Water Cycle',
    description: 'Follow water on its amazing journey around our planet',
    question: 'How does water move around our planet in the water cycle?',
    targetTopic: 'water cycle and weather',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'being-kind'
  },
  {
    id: 'different-cultures',
    title: 'Cultures Around the World',
    description: 'Explore the wonderful diversity of human cultures',
    question: 'What makes different cultures around the world special and unique?',
    targetTopic: 'cultural diversity and traditions',
    difficulty: 'beginner',
    category: 'history',
    unlockAfter: 'water-cycle'
  },

  // Intermediate Levels (11-20) - More complex thinking
  {
    id: 'problem-solving',
    title: 'Becoming a Problem Solver',
    description: 'Learn strategies for solving tricky problems',
    question: 'What are some good strategies for solving difficult problems?',
    targetTopic: 'problem-solving strategies',
    difficulty: 'intermediate',
    category: 'philosophy',
    unlockAfter: 'different-cultures'
  },
  {
    id: 'ecosystems',
    title: 'How Nature Works Together',
    description: 'Understand how plants, animals, and environment connect',
    question: 'How do plants, animals, and their environment work together in ecosystems?',
    targetTopic: 'ecosystems and interdependence',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'problem-solving'
  },
  {
    id: 'invention-process',
    title: 'How Inventions Are Born',
    description: 'Discover the process of creating new inventions',
    question: 'How do inventors come up with new ideas and turn them into real inventions?',
    targetTopic: 'innovation and invention process',
    difficulty: 'intermediate',
    category: 'technology',
    unlockAfter: 'ecosystems'
  },
  {
    id: 'right-and-wrong',
    title: 'Making Good Choices',
    description: 'Think about how we decide what is right and wrong',
    question: 'How do we figure out what is right and wrong when making decisions?',
    targetTopic: 'ethics and moral decision-making',
    difficulty: 'intermediate',
    category: 'philosophy',
    unlockAfter: 'invention-process'
  },
  {
    id: 'ancient-civilizations',
    title: 'Great Ancient Civilizations',
    description: 'Learn about amazing civilizations from long ago',
    question: 'What made ancient civilizations like Egypt, Greece, or China so successful?',
    targetTopic: 'ancient civilizations and their achievements',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'right-and-wrong'
  },
  {
    id: 'energy-sources',
    title: 'Power for Our World',
    description: 'Explore different ways we can power our modern world',
    question: 'What are different ways we can create energy to power our homes and cities?',
    targetTopic: 'energy sources and sustainability',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'ancient-civilizations'
  },
  {
    id: 'communication',
    title: 'How We Share Ideas',
    description: 'Understand how humans communicate and share knowledge',
    question: 'How have humans developed different ways to communicate and share ideas?',
    targetTopic: 'communication and language evolution',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'energy-sources'
  },
  {
    id: 'scientific-method',
    title: 'Thinking Like a Scientist',
    description: 'Learn how scientists discover new things about our world',
    question: 'How do scientists make sure their discoveries are accurate and reliable?',
    targetTopic: 'scientific method and critical thinking',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'communication'
  },
  {
    id: 'cooperation',
    title: 'Working Together',
    description: 'Explore why cooperation helps humans achieve great things',
    question: 'Why is working together often better than working alone?',
    targetTopic: 'cooperation and teamwork',
    difficulty: 'intermediate',
    category: 'philosophy',
    unlockAfter: 'scientific-method'
  },
  {
    id: 'technology-impact',
    title: 'How Technology Changes Life',
    description: 'Think about how technology affects our daily lives',
    question: 'How has technology changed the way people live and interact with each other?',
    targetTopic: 'technology and social change',
    difficulty: 'intermediate',
    category: 'technology',
    unlockAfter: 'cooperation'
  },

  // Advanced Levels (21-30) - Complex concepts and critical thinking
  {
    id: 'climate-change',
    title: 'Our Changing Climate',
    description: 'Understand climate change and what we can do about it',
    question: 'What is climate change and how can people help protect our planet?',
    targetTopic: 'climate change and environmental action',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'technology-impact'
  },
  {
    id: 'democracy',
    title: 'Making Decisions Together',
    description: 'Learn about democracy and how societies make group decisions',
    question: 'How does democracy help groups of people make fair decisions together?',
    targetTopic: 'democracy and civic participation',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'climate-change'
  },
  {
    id: 'space-exploration',
    title: 'Exploring the Cosmos',
    description: 'Discover what we learn by exploring space',
    question: 'Why do humans explore space and what have we discovered out there?',
    targetTopic: 'space exploration and astronomy',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'democracy'
  },
  {
    id: 'artificial-creativity',
    title: 'Can Machines Be Creative?',
    description: 'Think about whether AI can truly be creative like humans',
    question: 'Can artificial intelligence be truly creative, or is creativity uniquely human?',
    targetTopic: 'AI creativity and human uniqueness',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'space-exploration'
  },
  {
    id: 'justice-fairness',
    title: 'What Makes Things Fair?',
    description: 'Explore the challenging question of what justice means',
    question: 'What does it mean for something to be fair or just?',
    targetTopic: 'justice and fairness concepts',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'artificial-creativity'
  },
  {
    id: 'human-evolution',
    title: 'The Human Journey',
    description: 'Learn about how humans evolved and spread around the world',
    question: 'How did humans evolve and develop the amazing abilities we have today?',
    targetTopic: 'human evolution and development',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'justice-fairness'
  },
  {
    id: 'economic-systems',
    title: 'How Economies Work',
    description: 'Understand basic concepts about how economies function',
    question: 'How do economic systems help people trade and share resources?',
    targetTopic: 'economic systems and resource allocation',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'human-evolution'
  },
  {
    id: 'future-technology',
    title: 'Technology of Tomorrow',
    description: 'Imagine what future technology might look like',
    question: 'What might technology be like in the future and how should we prepare?',
    targetTopic: 'future technology and preparation',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'economic-systems'
  },
  {
    id: 'meaning-purpose',
    title: 'Finding Purpose in Life',
    description: 'Think about what gives life meaning and purpose',
    question: 'What gives life meaning and how do people find their purpose?',
    targetTopic: 'life meaning and personal purpose',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'future-technology'
  },
  {
    id: 'global-challenges',
    title: 'Solving World Problems',
    description: 'Consider how we can work together to solve global challenges',
    question: 'How can people around the world work together to solve big problems?',
    targetTopic: 'global cooperation and problem-solving',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'meaning-purpose'
  }
]