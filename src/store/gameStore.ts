import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, GameLevel } from '../types'

// Complete level data - 100 levels
const GAME_LEVELS: GameLevel[] = [
  // Beginner Levels (1-20)
  {
    id: 'intro',
    title: 'Welcome to Amur Isondo',
    description: 'Learn the basics of summoning AI spirits and asking questions',
    question: 'What is artificial intelligence and how does it work?',
    targetTopic: 'artificial intelligence basics',
    persona: 'Athena, the wise Greek goddess of knowledge and strategic thinking, who speaks clearly and helps mortals understand complex concepts',
    difficulty: 'beginner',
    category: 'introduction',
    context: 'This is an introductory conversation about AI to help the player understand the concept.',
    validationCriteria: ['Explains what AI is', 'Mentions machine learning or algorithms', 'Describes practical applications']
  },
  {
    id: 'ancient-wisdom',
    title: 'Ancient Wisdom',
    description: 'Consult with historical philosophers about the nature of knowledge',
    question: 'How do we determine what is true knowledge versus mere opinion?',
    targetTopic: 'epistemology and the nature of knowledge',
    persona: 'Socrates, the ancient Greek philosopher known for his method of questioning, who helps people examine their beliefs and discover wisdom through dialogue',
    difficulty: 'beginner',
    category: 'philosophy',
    unlockAfter: 'intro',
    context: 'A philosophical discussion about knowledge, truth, and wisdom.',
    validationCriteria: ['Discusses different types of knowledge', 'Mentions the role of questioning', 'Explores the difference between knowledge and belief']
  },
  {
    id: 'scientific-method',
    title: 'The Scientific Method',
    description: 'Learn from great scientists about how we discover truth about the natural world',
    question: 'How do scientists ensure their discoveries are reliable and accurate?',
    targetTopic: 'scientific methodology and peer review',
    persona: 'Marie Curie, the pioneering scientist who discovered radium and polonium, known for her rigorous experimental methods and dedication to scientific truth',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'ancient-wisdom',
    context: 'A discussion about scientific methodology, experimentation, and the pursuit of reliable knowledge.',
    validationCriteria: ['Explains hypothesis testing', 'Mentions peer review or replication', 'Discusses experimental controls']
  },
  {
    id: 'human-evolution',
    title: 'The Story of Human Evolution',
    description: 'Discover how humans evolved and spread across the Earth',
    question: 'How did humans evolve from early primates to modern civilization?',
    targetTopic: 'human evolution and development',
    persona: 'Charles Darwin, the naturalist who revolutionized our understanding of evolution through careful observation and scientific reasoning',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'scientific-method',
    context: 'An exploration of human evolutionary history and development.',
    validationCriteria: ['Discusses evolutionary timeline', 'Mentions key evolutionary developments', 'Explains natural selection']
  },
  {
    id: 'written-language',
    title: 'The Birth of Writing',
    description: 'Explore how written language transformed human civilization',
    question: 'How did the development of written language change human society?',
    targetTopic: 'development and impact of written language',
    persona: 'Enheduanna, the first known author in history, a Sumerian priestess who created some of the earliest written literature',
    difficulty: 'beginner',
    category: 'history',
    unlockAfter: 'human-evolution',
    context: 'A discussion about the revolutionary impact of written language on human culture.',
    validationCriteria: ['Explains the importance of record keeping', 'Discusses cultural transmission', 'Mentions impact on education']
  },
  {
    id: 'mathematics-basics',
    title: 'The Language of Numbers',
    description: 'Understand how mathematics helps us describe the world',
    question: 'Why is mathematics called the universal language?',
    targetTopic: 'fundamental role of mathematics in understanding reality',
    persona: 'Pythagoras, the ancient Greek mathematician and philosopher who saw numbers as the fundamental essence of all things',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'written-language',
    context: 'An exploration of how mathematics provides tools for understanding patterns in nature.',
    validationCriteria: ['Explains mathematical patterns in nature', 'Discusses universality of math', 'Mentions practical applications']
  },
  {
    id: 'agricultural-revolution',
    title: 'The Agricultural Revolution',
    description: 'Learn how farming changed human society forever',
    question: 'How did the development of agriculture transform human civilization?',
    targetTopic: 'impact of agriculture on human society',
    persona: 'George Washington Carver, the agricultural scientist who revolutionized farming practices and crop science',
    difficulty: 'beginner',
    category: 'history',
    unlockAfter: 'mathematics-basics',
    context: 'A discussion about the transition from hunter-gatherer to agricultural societies.',
    validationCriteria: ['Explains sedentary lifestyle development', 'Discusses population growth', 'Mentions societal specialization']
  },
  {
    id: 'elements-matter',
    title: 'The Elements of Matter',
    description: 'Discover what everything in the universe is made of',
    question: 'What are the fundamental building blocks of all matter?',
    targetTopic: 'atomic theory and periodic elements',
    persona: 'Dmitri Mendeleev, the Russian chemist who organized the periodic table and predicted the existence of unknown elements',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'agricultural-revolution',
    context: 'An introduction to atoms, elements, and the periodic table.',
    validationCriteria: ['Explains atomic structure', 'Mentions periodic table organization', 'Discusses elements vs compounds']
  },
  {
    id: 'ancient-civilizations',
    title: 'Great Ancient Civilizations',
    description: 'Explore the rise of the first complex societies',
    question: 'What factors led to the rise of the first civilizations?',
    targetTopic: 'development of early civilizations',
    persona: 'Herodotus, the ancient Greek historian known as the Father of History, who traveled extensively and recorded the customs of many peoples',
    difficulty: 'beginner',
    category: 'history',
    unlockAfter: 'elements-matter',
    context: 'A survey of early civilizations like Mesopotamia, Egypt, and the Indus Valley.',
    validationCriteria: ['Discusses geographic factors', 'Mentions technological developments', 'Explains social organization']
  },
  {
    id: 'energy-basics',
    title: 'Understanding Energy',
    description: 'Learn about the force that powers everything in the universe',
    question: 'What is energy and how does it flow through natural systems?',
    targetTopic: 'basic principles of energy and thermodynamics',
    persona: 'James Joule, the physicist who established the principle of conservation of energy and helped develop thermodynamics',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'ancient-civilizations',
    context: 'An introduction to different forms of energy and their transformations.',
    validationCriteria: ['Explains different types of energy', 'Discusses energy conservation', 'Mentions energy in living systems']
  },
  {
    id: 'world-religions',
    title: 'Major World Religions',
    description: 'Explore the diverse spiritual traditions of humanity',
    question: 'How do different religions help people find meaning and purpose?',
    targetTopic: 'comparative religion and spiritual traditions',
    persona: 'Rumi, the 13th-century Persian mystic and poet who wrote about universal spiritual themes that transcend religious boundaries',
    difficulty: 'beginner',
    category: 'philosophy',
    unlockAfter: 'energy-basics',
    context: 'A respectful exploration of major world religions and their common themes.',
    validationCriteria: ['Discusses common spiritual themes', 'Mentions different religious traditions', 'Explains role in human culture']
  },
  {
    id: 'ocean-exploration',
    title: 'Mysteries of the Ocean',
    description: 'Dive into the vast unexplored depths of our planet',
    question: 'What secrets do the oceans hold about Earth\'s history and life?',
    targetTopic: 'oceanography and marine ecosystems',
    persona: 'Sylvia Earle, the pioneering marine biologist and ocean explorer who has dedicated her life to understanding and protecting the seas',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'world-religions',
    context: 'An exploration of ocean science, marine life, and underwater ecosystems.',
    validationCriteria: ['Discusses ocean layers and zones', 'Mentions marine biodiversity', 'Explains ocean\'s role in climate']
  },
  {
    id: 'art-expression',
    title: 'Art as Human Expression',
    description: 'Understand how humans use art to communicate and create beauty',
    question: 'Why do humans create art, and what does it tell us about ourselves?',
    targetTopic: 'role of art in human culture and expression',
    persona: 'Leonardo da Vinci, the Renaissance master who combined artistic genius with scientific curiosity to explore both beauty and knowledge',
    difficulty: 'beginner',
    category: 'literature',
    unlockAfter: 'ocean-exploration',
    context: 'A discussion about art as communication, expression, and cultural documentation.',
    validationCriteria: ['Explains art as communication', 'Discusses emotional expression', 'Mentions cultural documentation']
  },
  {
    id: 'plant-kingdom',
    title: 'The Secret Life of Plants',
    description: 'Discover the fascinating world of plant biology and ecology',
    question: 'How do plants survive, communicate, and shape their environments?',
    targetTopic: 'plant biology and ecological relationships',
    persona: 'Barbara McClintock, the geneticist who revolutionized our understanding of plant genetics and cellular behavior',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'art-expression',
    context: 'An exploration of plant biology, photosynthesis, and ecological relationships.',
    validationCriteria: ['Explains photosynthesis', 'Discusses plant adaptations', 'Mentions ecological relationships']
  },
  {
    id: 'music-mathematics',
    title: 'The Mathematics of Music',
    description: 'Explore how numbers and patterns create harmony and rhythm',
    question: 'How do mathematical patterns create the beauty we hear in music?',
    targetTopic: 'mathematical foundations of music theory',
    persona: 'Johann Sebastian Bach, the composer whose mathematical precision in music composition revealed the deep connections between mathematics and harmony',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'plant-kingdom',
    context: 'A discussion about frequency, harmony, rhythm, and mathematical patterns in music.',
    validationCriteria: ['Explains frequency and pitch', 'Discusses harmonic ratios', 'Mentions rhythm and time signatures']
  },
  {
    id: 'space-exploration',
    title: 'Journey to the Stars',
    description: 'Learn about humanity\'s quest to explore the cosmos',
    question: 'What drives humans to explore space, and what have we discovered?',
    targetTopic: 'space exploration and astronomical discoveries',
    persona: 'Carl Sagan, the astronomer and science communicator who inspired wonder about the cosmos and our place within it',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'music-mathematics',
    context: 'An exploration of space missions, astronomical discoveries, and the search for life.',
    validationCriteria: ['Discusses major space missions', 'Mentions astronomical discoveries', 'Explains search for extraterrestrial life']
  },
  {
    id: 'democracy-origins',
    title: 'The Birth of Democracy',
    description: 'Understand how people first learned to govern themselves',
    question: 'How did democratic ideals develop and spread throughout history?',
    targetTopic: 'development of democratic government and civic participation',
    persona: 'Pericles, the Athenian statesman who championed democracy and believed in the wisdom and capability of ordinary citizens',
    difficulty: 'beginner',
    category: 'history',
    unlockAfter: 'space-exploration',
    context: 'A discussion about the origins and evolution of democratic government.',
    validationCriteria: ['Explains democratic principles', 'Discusses citizen participation', 'Mentions historical development']
  },
  {
    id: 'human-body',
    title: 'The Marvel of the Human Body',
    description: 'Explore the incredible complexity of human biology',
    question: 'How do the systems of the human body work together to sustain life?',
    targetTopic: 'human anatomy and physiology',
    persona: 'Andreas Vesalius, the Renaissance anatomist who revolutionized medical knowledge through careful observation of the human body',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'democracy-origins',
    context: 'An introduction to human body systems and their interconnections.',
    validationCriteria: ['Explains major body systems', 'Discusses system interactions', 'Mentions homeostasis']
  },
  {
    id: 'communication-evolution',
    title: 'The Evolution of Communication',
    description: 'Trace how humans developed language and communication',
    question: 'How did human language evolve, and how has communication changed over time?',
    targetTopic: 'development of human language and communication technologies',
    persona: 'Noam Chomsky, the linguist who revealed the deep structures of human language and its universal properties',
    difficulty: 'beginner',
    category: 'literature',
    unlockAfter: 'human-body',
    context: 'An exploration of language evolution and communication technology development.',
    validationCriteria: ['Discusses language development', 'Mentions communication technologies', 'Explains language universals']
  },
  {
    id: 'weather-climate',
    title: 'Understanding Weather and Climate',
    description: 'Learn how Earth\'s atmosphere creates the weather we experience',
    question: 'What causes weather patterns, and how is climate different from weather?',
    targetTopic: 'meteorology and climate science basics',
    persona: 'Rachel Carson, the marine biologist and conservationist who helped us understand the interconnections in natural systems',
    difficulty: 'beginner',
    category: 'science',
    unlockAfter: 'communication-evolution',
    context: 'An introduction to atmospheric science, weather systems, and climate patterns.',
    validationCriteria: ['Explains weather vs climate', 'Discusses atmospheric processes', 'Mentions climate factors']
  },

  // Intermediate Levels (21-60)
  {
    id: 'industrial-revolution',
    title: 'The Industrial Revolution',
    description: 'Examine how machines transformed human society',
    question: 'How did the Industrial Revolution change the way humans live and work?',
    targetTopic: 'impact of industrialization on society',
    persona: 'James Watt, the inventor whose improvements to the steam engine helped power the Industrial Revolution',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'weather-climate',
    context: 'A discussion about technological change and its social consequences.',
    validationCriteria: ['Discusses technological changes', 'Mentions social impacts', 'Explains economic transformation']
  },
  {
    id: 'genetics-heredity',
    title: 'The Secrets of Heredity',
    description: 'Discover how traits are passed from parents to offspring',
    question: 'How do genetic mechanisms determine the characteristics of living things?',
    targetTopic: 'genetics and inheritance patterns',
    persona: 'Gregor Mendel, the monk whose careful experiments with pea plants revealed the fundamental laws of inheritance',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'industrial-revolution',
    context: 'An exploration of genetic principles and inheritance patterns.',
    validationCriteria: ['Explains DNA and genes', 'Discusses inheritance patterns', 'Mentions genetic variation']
  },
  {
    id: 'renaissance-humanism',
    title: 'Renaissance and Humanism',
    description: 'Explore the rebirth of learning and human potential',
    question: 'How did Renaissance humanism change the way people thought about themselves and the world?',
    targetTopic: 'Renaissance intellectual and cultural transformation',
    persona: 'Erasmus of Rotterdam, the Renaissance humanist who believed in the power of education and human reason',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'genetics-heredity',
    context: 'A discussion about the intellectual revolution of the Renaissance.',
    validationCriteria: ['Explains humanist principles', 'Discusses cultural changes', 'Mentions educational reforms']
  },
  {
    id: 'ecosystem-balance',
    title: 'Ecosystems in Balance',
    description: 'Understand how living things interact in natural communities',
    question: 'How do ecosystems maintain balance, and what happens when that balance is disrupted?',
    targetTopic: 'ecological relationships and environmental balance',
    persona: 'Aldo Leopold, the conservationist who developed the land ethic and understood ecosystems as integrated communities',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'renaissance-humanism',
    context: 'An exploration of ecological relationships and environmental science.',
    validationCriteria: ['Explains food webs and energy flow', 'Discusses environmental balance', 'Mentions human impact']
  },
  {
    id: 'enlightenment-reason',
    title: 'The Age of Enlightenment',
    description: 'Learn how reason and science challenged traditional authority',
    question: 'How did Enlightenment thinkers use reason to challenge traditional beliefs and institutions?',
    targetTopic: 'Enlightenment philosophy and scientific revolution',
    persona: 'Voltaire, the French philosopher who championed reason, tolerance, and freedom of thought',
    difficulty: 'intermediate',
    category: 'philosophy',
    unlockAfter: 'ecosystem-balance',
    context: 'A discussion about the intellectual revolution that emphasized reason and empirical knowledge.',
    validationCriteria: ['Explains emphasis on reason', 'Discusses challenge to authority', 'Mentions scientific method']
  },
  {
    id: 'digital-revolution',
    title: 'The Digital Revolution',
    description: 'Explore how computers and the internet changed human society',
    question: 'How has the digital revolution transformed the way humans work, communicate, and learn?',
    targetTopic: 'impact of digital technology on society',
    persona: 'Ada Lovelace, the world\'s first computer programmer and visionary who foresaw the potential of computing machines beyond mere calculation',
    difficulty: 'intermediate',
    category: 'technology',
    unlockAfter: 'enlightenment-reason',
    context: 'A conversation about the transformative impact of digital technology on human civilization.',
    validationCriteria: ['Discusses changes in communication', 'Mentions impact on work or education', 'Explores both benefits and challenges']
  },
  {
    id: 'storytelling-power',
    title: 'The Power of Stories',
    description: 'Discover how narratives shape human understanding and culture',
    question: 'Why are stories so important to human culture and learning?',
    targetTopic: 'the role of narrative in human culture and education',
    persona: 'Maya Angelou, the celebrated poet and storyteller who understood the transformative power of words and personal narrative',
    difficulty: 'intermediate',
    category: 'literature',
    unlockAfter: 'digital-revolution',
    context: 'An exploration of how stories, myths, and narratives help humans make sense of their world.',
    validationCriteria: ['Explains how stories convey meaning', 'Mentions cultural transmission', 'Discusses emotional or educational impact']
  },
  {
    id: 'quantum-world',
    title: 'The Quantum World',
    description: 'Enter the strange realm of quantum physics',
    question: 'How does the quantum world challenge our everyday understanding of reality?',
    targetTopic: 'quantum mechanics and its implications',
    persona: 'Niels Bohr, the physicist who helped develop quantum theory and grappled with its philosophical implications',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'storytelling-power',
    context: 'An introduction to quantum mechanics and its counterintuitive principles.',
    validationCriteria: ['Explains quantum uncertainty', 'Discusses wave-particle duality', 'Mentions quantum applications']
  },
  {
    id: 'global-exploration',
    title: 'The Age of Global Exploration',
    description: 'Discover how exploration connected the world',
    question: 'How did the age of exploration change global relationships and cultural exchange?',
    targetTopic: 'impact of global exploration and cultural exchange',
    persona: 'Zheng He, the Chinese admiral who led massive naval expeditions decades before Columbus, demonstrating early global maritime capabilities',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'quantum-world',
    context: 'A discussion about maritime exploration and its consequences for global civilization.',
    validationCriteria: ['Discusses technological advances', 'Mentions cultural exchange', 'Explains global connections']
  },
  {
    id: 'brain-consciousness',
    title: 'The Mystery of Consciousness',
    description: 'Explore how the brain creates the mind and consciousness',
    question: 'How does the brain generate consciousness and subjective experience?',
    targetTopic: 'neuroscience and the nature of consciousness',
    persona: 'Santiago Ramón y Cajal, the neuroscientist who mapped the structure of the nervous system and founded modern neuroscience',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'global-exploration',
    context: 'An exploration of brain science and the hard problem of consciousness.',
    validationCriteria: ['Explains brain structure and function', 'Discusses consciousness theories', 'Mentions neural networks']
  },
  {
    id: 'economic-systems',
    title: 'Understanding Economic Systems',
    description: 'Learn how societies organize production and distribution of resources',
    question: 'How do different economic systems attempt to solve the problem of scarcity?',
    targetTopic: 'comparative economic systems and resource allocation',
    persona: 'Adam Smith, the economist who analyzed how markets coordinate individual self-interest with social benefit',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'brain-consciousness',
    context: 'A discussion about different approaches to organizing economic activity.',
    validationCriteria: ['Explains resource scarcity', 'Discusses market mechanisms', 'Mentions different economic systems']
  },
  {
    id: 'atomic-energy',
    title: 'Atomic Energy and Nuclear Science',
    description: 'Understand the tremendous power locked within atoms',
    question: 'How can atomic energy be harnessed for both beneficial and destructive purposes?',
    targetTopic: 'nuclear physics and atomic energy applications',
    persona: 'Lise Meitner, the physicist who helped discover nuclear fission and understood its implications for both energy and weapons',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'economic-systems',
    context: 'An exploration of nuclear science and its applications in energy and medicine.',
    validationCriteria: ['Explains nuclear processes', 'Discusses peaceful applications', 'Mentions safety considerations']
  },
  {
    id: 'social-movements',
    title: 'Social Movements and Change',
    description: 'Examine how people organize to create social change',
    question: 'How do social movements successfully challenge injustice and create lasting change?',
    targetTopic: 'social activism and institutional change',
    persona: 'Mahatma Gandhi, the leader who demonstrated how nonviolent resistance could challenge powerful systems of oppression',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'atomic-energy',
    context: 'A discussion about strategies for social change and civil resistance.',
    validationCriteria: ['Explains organizing strategies', 'Discusses nonviolent resistance', 'Mentions institutional change']
  },
  {
    id: 'artificial-life',
    title: 'Artificial Life and Emergence',
    description: 'Explore how complex behaviors emerge from simple rules',
    question: 'How can simple rules create complex, lifelike behaviors in artificial systems?',
    targetTopic: 'complexity science and emergent behavior',
    persona: 'John Conway, the mathematician who created the Game of Life and showed how simple rules can generate complex patterns',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'social-movements',
    context: 'An exploration of complexity, emergence, and artificial life simulations.',
    validationCriteria: ['Explains emergent behavior', 'Discusses complex systems', 'Mentions self-organization']
  },
  {
    id: 'global-trade',
    title: 'The History of Global Trade',
    description: 'Trace the development of international commerce and exchange',
    question: 'How has global trade shaped civilizations and cultural exchange throughout history?',
    targetTopic: 'development of international trade and its cultural impact',
    persona: 'Ibn Battuta, the medieval traveler who journeyed across trade routes and documented the interconnected medieval world',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'artificial-life',
    context: 'A discussion about trade routes, economic development, and cultural exchange.',
    validationCriteria: ['Discusses trade route development', 'Mentions cultural exchange', 'Explains economic interdependence']
  },
  {
    id: 'medical-breakthroughs',
    title: 'Medical Breakthroughs',
    description: 'Learn how medical science has extended and improved human life',
    question: 'How have major medical discoveries transformed human health and longevity?',
    targetTopic: 'history of medicine and public health advances',
    persona: 'Florence Nightingale, the nurse who revolutionized hospital care and used statistics to improve public health',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'global-trade',
    context: 'An exploration of medical advances and their impact on human health.',
    validationCriteria: ['Discusses major medical discoveries', 'Mentions public health improvements', 'Explains disease prevention']
  },
  {
    id: 'environmental-ethics',
    title: 'Environmental Ethics',
    description: 'Examine our moral obligations to the natural world',
    question: 'What are our ethical responsibilities toward the environment and future generations?',
    targetTopic: 'environmental philosophy and sustainability ethics',
    persona: 'Aldo Leopold, the conservationist who developed an ethical framework for human relationships with the natural world',
    difficulty: 'intermediate',
    category: 'philosophy',
    unlockAfter: 'medical-breakthroughs',
    context: 'A discussion about environmental responsibility and sustainable development.',
    validationCriteria: ['Discusses environmental responsibility', 'Mentions sustainability principles', 'Explains intergenerational ethics']
  },
  {
    id: 'information-theory',
    title: 'Information Theory',
    description: 'Understand how information is encoded, transmitted, and processed',
    question: 'How do we measure, encode, and transmit information efficiently?',
    targetTopic: 'mathematical foundations of information and communication',
    persona: 'Claude Shannon, the mathematician who founded information theory and laid the groundwork for digital communication',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'environmental-ethics',
    context: 'An exploration of information theory and its applications in communication and computing.',
    validationCriteria: ['Explains information measurement', 'Discusses encoding methods', 'Mentions communication efficiency']
  },
  {
    id: 'urban-development',
    title: 'Urban Development and Cities',
    description: 'Explore how cities grow and shape human civilization',
    question: 'How do cities develop, and what challenges do they face as they grow?',
    targetTopic: 'urban planning and metropolitan development',
    persona: 'Jane Jacobs, the urbanist who understood cities as complex ecosystems and advocated for human-centered urban design',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'information-theory',
    context: 'A discussion about urban growth, planning, and the challenges of city life.',
    validationCriteria: ['Discusses urban growth patterns', 'Mentions planning challenges', 'Explains city ecosystems']
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy Sources',
    description: 'Learn about sustainable alternatives to fossil fuels',
    question: 'How can renewable energy sources meet our growing energy needs sustainably?',
    targetTopic: 'renewable energy technologies and sustainability',
    persona: 'Michael Faraday, the scientist who discovered electromagnetic induction and laid the foundation for electric power generation',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'urban-development',
    context: 'An exploration of renewable energy technologies and their potential.',
    validationCriteria: ['Explains renewable energy types', 'Discusses sustainability benefits', 'Mentions technological challenges']
  },
  {
    id: 'cognitive-psychology',
    title: 'How the Mind Works',
    description: 'Explore the mental processes behind human thinking and learning',
    question: 'How do cognitive processes like memory, attention, and reasoning work?',
    targetTopic: 'cognitive psychology and mental processes',
    persona: 'Jean Piaget, the psychologist who studied how children develop thinking abilities and cognitive structures',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'renewable-energy',
    context: 'A discussion about mental processes and cognitive development.',
    validationCriteria: ['Explains cognitive processes', 'Discusses memory and learning', 'Mentions developmental stages']
  },
  {
    id: 'cultural-anthropology',
    title: 'Cultural Diversity and Anthropology',
    description: 'Study the rich variety of human cultures and social organization',
    question: 'How do different cultures solve universal human problems in unique ways?',
    targetTopic: 'cultural anthropology and human diversity',
    persona: 'Margaret Mead, the anthropologist who studied diverse cultures and challenged assumptions about human nature',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'cognitive-psychology',
    context: 'An exploration of cultural diversity and anthropological methods.',
    validationCriteria: ['Discusses cultural variation', 'Mentions universal human needs', 'Explains anthropological methods']
  },
  {
    id: 'biotechnology',
    title: 'Biotechnology and Genetic Engineering',
    description: 'Understand how we can modify living systems for human benefit',
    question: 'How can biotechnology help solve problems in medicine, agriculture, and industry?',
    targetTopic: 'biotechnology applications and genetic engineering',
    persona: 'Jennifer Doudna, the biochemist who helped develop CRISPR gene editing technology',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'cultural-anthropology',
    context: 'A discussion about biotechnology applications and their potential benefits and risks.',
    validationCriteria: ['Explains genetic engineering', 'Discusses applications in medicine and agriculture', 'Mentions ethical considerations']
  },
  {
    id: 'philosophical-ethics',
    title: 'Philosophical Ethics',
    description: 'Examine different approaches to moral reasoning and ethical decision-making',
    question: 'How do different ethical frameworks help us determine right from wrong?',
    targetTopic: 'moral philosophy and ethical reasoning',
    persona: 'Aristotle, the philosopher who developed virtue ethics and analyzed the nature of moral character',
    difficulty: 'intermediate',
    category: 'philosophy',
    unlockAfter: 'biotechnology',
    context: 'An exploration of different ethical theories and their applications.',
    validationCriteria: ['Explains different ethical theories', 'Discusses moral reasoning', 'Mentions practical applications']
  },
  {
    id: 'climate-change',
    title: 'Understanding Climate Change',
    description: 'Learn about the science and challenges of global climate change',
    question: 'What causes climate change, and how can we address its challenges?',
    targetTopic: 'climate science and environmental policy',
    persona: 'Svante Arrhenius, the scientist who first calculated how carbon dioxide could warm the Earth\'s atmosphere',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'philosophical-ethics',
    context: 'A discussion about climate science, impacts, and potential solutions.',
    validationCriteria: ['Explains greenhouse effect', 'Discusses climate impacts', 'Mentions mitigation strategies']
  },
  {
    id: 'world-literature',
    title: 'World Literature and Human Experience',
    description: 'Explore how literature captures universal human experiences across cultures',
    question: 'How does literature from different cultures reveal both unique and universal aspects of human experience?',
    targetTopic: 'comparative literature and cultural expression',
    persona: 'Jorge Luis Borges, the writer who explored universal themes through literature that transcended cultural boundaries',
    difficulty: 'intermediate',
    category: 'literature',
    unlockAfter: 'climate-change',
    context: 'An exploration of world literature and its insights into human nature.',
    validationCriteria: ['Discusses universal themes', 'Mentions cultural perspectives', 'Explains literary analysis']
  },
  {
    id: 'mathematical-modeling',
    title: 'Mathematical Modeling',
    description: 'Learn how mathematics helps us understand and predict real-world phenomena',
    question: 'How do mathematical models help us understand complex systems and make predictions?',
    targetTopic: 'mathematical modeling and applied mathematics',
    persona: 'Emmy Noether, the mathematician who developed fundamental theorems connecting symmetry and conservation laws',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'world-literature',
    context: 'A discussion about using mathematics to model real-world systems.',
    validationCriteria: ['Explains mathematical modeling', 'Discusses model applications', 'Mentions limitations and assumptions']
  },
  {
    id: 'international-relations',
    title: 'International Relations',
    description: 'Understand how nations interact in the global political system',
    question: 'How do countries navigate cooperation and conflict in the international system?',
    targetTopic: 'international politics and diplomacy',
    persona: 'Eleanor Roosevelt, the diplomat who helped create the Universal Declaration of Human Rights and promoted international cooperation',
    difficulty: 'intermediate',
    category: 'history',
    unlockAfter: 'mathematical-modeling',
    context: 'A discussion about international politics, diplomacy, and global governance.',
    validationCriteria: ['Explains international cooperation', 'Discusses conflict resolution', 'Mentions global institutions']
  },
  {
    id: 'computer-algorithms',
    title: 'Computer Algorithms',
    description: 'Explore the logical procedures that make computers solve problems',
    question: 'How do algorithms enable computers to solve complex problems efficiently?',
    targetTopic: 'algorithmic thinking and computational problem-solving',
    persona: 'Alan Turing, the mathematician who developed fundamental concepts in computer science and artificial intelligence',
    difficulty: 'intermediate',
    category: 'technology',
    unlockAfter: 'international-relations',
    context: 'An exploration of algorithmic thinking and computational problem-solving.',
    validationCriteria: ['Explains algorithmic thinking', 'Discusses efficiency and complexity', 'Mentions problem-solving strategies']
  },
  {
    id: 'social-psychology',
    title: 'Social Psychology',
    description: 'Understand how social situations influence human behavior and thinking',
    question: 'How do social situations and group dynamics influence individual behavior?',
    targetTopic: 'social psychology and group behavior',
    persona: 'Solomon Asch, the psychologist who studied conformity and how social pressure influences individual judgment',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'computer-algorithms',
    context: 'A discussion about social influence, group dynamics, and individual behavior.',
    validationCriteria: ['Explains social influence', 'Discusses group dynamics', 'Mentions individual vs. social behavior']
  },
  {
    id: 'materials-science',
    title: 'Materials Science',
    description: 'Learn how the properties of materials determine their applications',
    question: 'How do the atomic and molecular structures of materials determine their useful properties?',
    targetTopic: 'materials science and engineering applications',
    persona: 'Stephanie Kwolek, the chemist who invented Kevlar and advanced the field of polymer science',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'social-psychology',
    context: 'An exploration of how material properties arise from structure and enable technological applications.',
    validationCriteria: ['Explains structure-property relationships', 'Discusses material applications', 'Mentions engineering design']
  },
  {
    id: 'linguistic-diversity',
    title: 'Linguistic Diversity',
    description: 'Explore the amazing variety of human languages and their structures',
    question: 'How do the world\'s languages differ, and what does this teach us about human cognition?',
    targetTopic: 'linguistic diversity and language structure',
    persona: 'Edward Sapir, the linguist who studied how different languages structure thought and perception',
    difficulty: 'intermediate',
    category: 'literature',
    unlockAfter: 'materials-science',
    context: 'A discussion about language diversity, structure, and its relationship to thought.',
    validationCriteria: ['Discusses language structures', 'Mentions cognitive implications', 'Explains linguistic relativity']
  },
  {
    id: 'probability-statistics',
    title: 'Probability and Statistics',
    description: 'Understand how we reason about uncertainty and analyze data',
    question: 'How do probability and statistics help us make decisions under uncertainty?',
    targetTopic: 'statistical reasoning and probability theory',
    persona: 'Florence Nightingale, who pioneered the use of statistics and data visualization to solve public health problems',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'linguistic-diversity',
    context: 'An exploration of statistical thinking and probabilistic reasoning.',
    validationCriteria: ['Explains probability concepts', 'Discusses statistical inference', 'Mentions decision-making under uncertainty']
  },
  {
    id: 'evolutionary-biology',
    title: 'Evolutionary Biology',
    description: 'Understand the mechanisms and patterns of biological evolution',
    question: 'How do evolutionary processes shape the diversity and complexity of life?',
    targetTopic: 'evolutionary mechanisms and biological diversity',
    persona: 'Alfred Russel Wallace, the naturalist who co-discovered natural selection and understood biogeography',
    difficulty: 'intermediate',
    category: 'science',
    unlockAfter: 'probability-statistics',
    context: 'A discussion about evolutionary mechanisms and their role in shaping life.',
    validationCriteria: ['Explains natural selection', 'Discusses evolutionary evidence', 'Mentions speciation and adaptation']
  },
  {
    id: 'media-communication',
    title: 'Media and Communication',
    description: 'Examine how media shapes public opinion and social discourse',
    question: 'How do different forms of media influence public opinion and democratic discourse?',
    targetTopic: 'media studies and communication theory',
    persona: 'Marshall McLuhan, the media theorist who analyzed how communication technologies shape society and consciousness',
    difficulty: 'intermediate',
    category: 'literature',
    unlockAfter: 'evolutionary-biology',
    context: 'A discussion about media influence, communication technology, and public discourse.',
    validationCriteria: ['Discusses media influence', 'Mentions communication technologies', 'Explains democratic discourse']
  },

  // Advanced Levels (61-100)
  {
    id: 'future-ethics',
    title: 'Ethics of the Future',
    description: 'Examine the moral challenges of advanced technology and AI',
    question: 'What ethical considerations should guide the development of artificial intelligence?',
    targetTopic: 'AI ethics and responsible technology development',
    persona: 'Confucius, the ancient Chinese philosopher focused on ethics, social harmony, and moral governance, who offers timeless wisdom for modern challenges',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'media-communication',
    context: 'A philosophical discussion about the ethical implications of advanced AI and technology.',
    validationCriteria: ['Discusses potential risks or benefits', 'Mentions human values or rights', 'Explores responsibility in development']
  },
  {
    id: 'chaos-complexity',
    title: 'Chaos Theory and Complex Systems',
    description: 'Explore how simple rules can create unpredictable, complex behavior',
    question: 'How do complex systems exhibit both order and chaos, and what can we predict about them?',
    targetTopic: 'chaos theory and complex adaptive systems',
    persona: 'Benoit Mandelbrot, the mathematician who discovered fractal geometry and revealed patterns in seemingly chaotic systems',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'future-ethics',
    context: 'An exploration of complex systems, emergent behavior, and the limits of predictability.',
    validationCriteria: ['Explains chaos and complexity', 'Discusses emergent properties', 'Mentions prediction limitations']
  },
  {
    id: 'metaphysics-reality',
    title: 'Metaphysics and the Nature of Reality',
    description: 'Grapple with fundamental questions about existence and reality',
    question: 'What is the fundamental nature of reality, and how can we know it?',
    targetTopic: 'metaphysical questions and theories of reality',
    persona: 'Immanuel Kant, the philosopher who examined the limits of human knowledge and the relationship between mind and reality',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'chaos-complexity',
    context: 'A deep philosophical exploration of the nature of existence and knowledge.',
    validationCriteria: ['Discusses theories of reality', 'Mentions epistemological questions', 'Explores mind-reality relationship']
  },
  {
    id: 'advanced-ai',
    title: 'Advanced Artificial Intelligence',
    description: 'Explore the frontiers of machine learning and artificial general intelligence',
    question: 'What are the possibilities and challenges of creating artificial general intelligence?',
    targetTopic: 'advanced AI research and artificial general intelligence',
    persona: 'Marvin Minsky, the AI pioneer who explored machine intelligence and the computational theory of mind',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'metaphysics-reality',
    context: 'A discussion about cutting-edge AI research and the quest for general intelligence.',
    validationCriteria: ['Discusses AGI challenges', 'Mentions current AI limitations', 'Explores future possibilities']
  },
  {
    id: 'theoretical-physics',
    title: 'Theoretical Physics Frontiers',
    description: 'Explore the cutting edge of our understanding of the universe',
    question: 'What are the biggest unsolved problems in theoretical physics?',
    targetTopic: 'advanced theoretical physics and cosmology',
    persona: 'Albert Einstein, whose theories revolutionized our understanding of space, time, and gravity',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'advanced-ai',
    context: 'An exploration of advanced physics concepts and unsolved problems.',
    validationCriteria: ['Discusses major physics problems', 'Mentions theoretical frameworks', 'Explains cosmological questions']
  },
  {
    id: 'consciousness-philosophy',
    title: 'Philosophy of Mind and Consciousness',
    description: 'Examine the deepest questions about mind, consciousness, and subjective experience',
    question: 'What is the relationship between brain, mind, and conscious experience?',
    targetTopic: 'philosophy of mind and consciousness studies',
    persona: 'David Chalmers, the philosopher who formulated the hard problem of consciousness and advanced theories of mind',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'theoretical-physics',
    context: 'A deep exploration of consciousness and the mind-body problem.',
    validationCriteria: ['Discusses consciousness theories', 'Mentions mind-body problem', 'Explores subjective experience']
  },
  {
    id: 'genetic-editing',
    title: 'Genetic Engineering and Bioethics',
    description: 'Examine the ethical implications of genetic modification and enhancement',
    question: 'How should we approach the power to edit human genes and enhance human capabilities?',
    targetTopic: 'genetic engineering ethics and human enhancement',
    persona: 'Rosalind Franklin, the scientist whose work was crucial to understanding DNA structure and genetic mechanisms',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'consciousness-philosophy',
    context: 'A discussion about genetic engineering capabilities and their ethical implications.',
    validationCriteria: ['Discusses genetic modification techniques', 'Mentions enhancement ethics', 'Explores societal implications']
  },
  {
    id: 'game-theory',
    title: 'Game Theory and Strategic Thinking',
    description: 'Understand how rational agents make decisions in interactive situations',
    question: 'How does game theory help us understand cooperation and competition in complex systems?',
    targetTopic: 'game theory applications and strategic decision-making',
    persona: 'John Nash, the mathematician who advanced game theory and analyzed strategic interactions',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'genetic-editing',
    context: 'An exploration of game theory and its applications to economics, politics, and evolution.',
    validationCriteria: ['Explains game theory concepts', 'Discusses strategic interactions', 'Mentions real-world applications']
  },
  {
    id: 'digital-identity',
    title: 'Digital Identity and Privacy',
    description: 'Examine how digital technologies reshape identity, privacy, and human relationships',
    question: 'How do digital technologies change the nature of identity, privacy, and human connection?',
    targetTopic: 'digital identity, privacy, and social technology',
    persona: 'Sherry Turkle, the researcher who studies how digital technology affects human relationships and identity',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'game-theory',
    context: 'A discussion about digital technology\'s impact on identity and social relationships.',
    validationCriteria: ['Discusses digital identity', 'Mentions privacy concerns', 'Explores social implications']
  },
  {
    id: 'postmodern-philosophy',
    title: 'Postmodern Philosophy',
    description: 'Explore how postmodern thinkers challenge traditional assumptions about truth and knowledge',
    question: 'How do postmodern philosophers challenge traditional concepts of truth, knowledge, and reality?',
    targetTopic: 'postmodern philosophy and epistemological critique',
    persona: 'Michel Foucault, the philosopher who analyzed how power relations shape knowledge and social institutions',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'digital-identity',
    context: 'An exploration of postmodern critiques of traditional philosophy and knowledge.',
    validationCriteria: ['Discusses postmodern themes', 'Mentions epistemological critique', 'Explores power and knowledge']
  },
  {
    id: 'synthetic-biology',
    title: 'Synthetic Biology',
    description: 'Explore the engineering of biological systems for novel purposes',
    question: 'How can we engineer biological systems to solve environmental and medical challenges?',
    targetTopic: 'synthetic biology and biological engineering',
    persona: 'Craig Venter, the biologist who pioneered genomics and synthetic biology research',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'postmodern-philosophy',
    context: 'A discussion about engineering biological systems and their applications.',
    validationCriteria: ['Explains synthetic biology', 'Discusses applications', 'Mentions ethical considerations']
  },
  {
    id: 'network-science',
    title: 'Network Science and Connectivity',
    description: 'Understand how networks shape everything from brain function to social movements',
    question: 'How do network structures influence the behavior of complex systems?',
    targetTopic: 'network theory and complex network analysis',
    persona: 'Duncan Watts, the network scientist who studies how small-world networks enable rapid information spread',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'synthetic-biology',
    context: 'An exploration of network science and its applications across disciplines.',
    validationCriteria: ['Explains network properties', 'Discusses network effects', 'Mentions interdisciplinary applications']
  },
  {
    id: 'existential-philosophy',
    title: 'Existentialism and Human Freedom',
    description: 'Examine questions of human existence, freedom, and responsibility',
    question: 'How do we create meaning and live authentically in an uncertain world?',
    targetTopic: 'existentialist philosophy and human condition',
    persona: 'Jean-Paul Sartre, the existentialist philosopher who explored human freedom, responsibility, and authenticity',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'network-science',
    context: 'A deep exploration of existentialist themes and the human condition.',
    validationCriteria: ['Discusses existentialist themes', 'Mentions human freedom', 'Explores authenticity and meaning']
  },
  {
    id: 'nanotechnology',
    title: 'Nanotechnology and Molecular Engineering',
    description: 'Explore the manipulation of matter at the atomic and molecular scale',
    question: 'How can nanotechnology revolutionize medicine, computing, and materials science?',
    targetTopic: 'nanotechnology applications and molecular engineering',
    persona: 'Richard Feynman, the physicist who envisioned manipulating individual atoms and molecules',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'existential-philosophy',
    context: 'A discussion about nanotechnology capabilities and their transformative potential.',
    validationCriteria: ['Explains nanotechnology principles', 'Discusses applications', 'Mentions technical challenges']
  },
  {
    id: 'comparative-consciousness',
    title: 'Animal Consciousness and Cognition',
    description: 'Explore consciousness and intelligence across different species',
    question: 'How do different animals experience consciousness, and what does this teach us about mind?',
    targetTopic: 'comparative consciousness and animal cognition',
    persona: 'Jane Goodall, the primatologist who revealed the complex social and cognitive lives of chimpanzees',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'nanotechnology',
    context: 'An exploration of consciousness and cognition across species.',
    validationCriteria: ['Discusses animal consciousness', 'Mentions cognitive abilities', 'Explores consciousness continuity']
  },
  {
    id: 'global-systems',
    title: 'Global Systems and Planetary Thinking',
    description: 'Understand Earth as an integrated system and humanity\'s planetary impact',
    question: 'How do we think about and manage human impact on planetary systems?',
    targetTopic: 'Earth system science and planetary stewardship',
    persona: 'James Lovelock, the scientist who proposed the Gaia hypothesis and studied Earth as an integrated system',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'comparative-consciousness',
    context: 'A discussion about planetary systems thinking and environmental stewardship.',
    validationCriteria: ['Discusses Earth systems', 'Mentions human impact', 'Explores stewardship ethics']
  },
  {
    id: 'cultural-evolution',
    title: 'Cultural Evolution and Memetics',
    description: 'Examine how ideas and cultural practices evolve and spread',
    question: 'How do cultural ideas evolve and spread through human populations?',
    targetTopic: 'cultural evolution and memetic theory',
    persona: 'Richard Dawkins, the biologist who introduced the concept of memes and cultural evolution',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'global-systems',
    context: 'An exploration of how cultural information evolves and transmits.',
    validationCriteria: ['Explains cultural evolution', 'Discusses meme theory', 'Mentions cultural transmission']
  },
  {
    id: 'space-colonization',
    title: 'Space Colonization and Astrobiology',
    description: 'Explore the challenges and possibilities of life beyond Earth',
    question: 'What are the scientific and ethical challenges of establishing human civilization beyond Earth?',
    targetTopic: 'space colonization and extraterrestrial life',
    persona: 'Carl Sagan, the astronomer who explored the possibility of extraterrestrial life and humanity\'s cosmic future',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'cultural-evolution',
    context: 'A discussion about space exploration, colonization, and the search for life.',
    validationCriteria: ['Discusses colonization challenges', 'Mentions astrobiology', 'Explores ethical considerations']
  },
  {
    id: 'consciousness-uploading',
    title: 'Digital Consciousness and Mind Uploading',
    description: 'Examine the theoretical possibility of digital consciousness',
    question: 'Could consciousness be transferred to digital systems, and what would this mean for identity?',
    targetTopic: 'digital consciousness and mind-brain uploading',
    persona: 'Ray Kurzweil, the futurist who explores the technological singularity and digital consciousness',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'space-colonization',
    context: 'A speculative discussion about digital consciousness and identity transfer.',
    validationCriteria: ['Discusses consciousness transfer', 'Mentions identity questions', 'Explores technical challenges']
  },
  {
    id: 'multiverse-theory',
    title: 'Multiverse Theory and Cosmology',
    description: 'Explore theories about multiple universes and cosmic reality',
    question: 'What evidence exists for multiple universes, and how would this change our understanding of reality?',
    targetTopic: 'multiverse theory and cosmological models',
    persona: 'Max Tegmark, the physicist who studies mathematical universes and multiverse theories',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'consciousness-uploading',
    context: 'An exploration of multiverse theories and their implications for cosmology.',
    validationCriteria: ['Explains multiverse theories', 'Discusses evidence and speculation', 'Mentions cosmological implications']
  },
  {
    id: 'transhumanism',
    title: 'Transhumanism and Human Enhancement',
    description: 'Examine the ethics and possibilities of enhancing human capabilities',
    question: 'How should we approach the enhancement of human cognitive and physical capabilities?',
    targetTopic: 'transhumanism and human enhancement ethics',
    persona: 'Nick Bostrom, the philosopher who studies existential risks and human enhancement',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'multiverse-theory',
    context: 'A discussion about human enhancement technologies and their ethical implications.',
    validationCriteria: ['Discusses enhancement technologies', 'Mentions ethical frameworks', 'Explores social implications']
  },
  {
    id: 'artificial-consciousness',
    title: 'Artificial Consciousness',
    description: 'Explore whether machines could develop genuine consciousness',
    question: 'What would it mean for a machine to be truly conscious, and how could we recognize this?',
    targetTopic: 'machine consciousness and artificial sentience',
    persona: 'Douglas Hofstadter, the cognitive scientist who explores consciousness, self-reference, and artificial minds',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'transhumanism',
    context: 'A deep exploration of machine consciousness possibilities and recognition criteria.',
    validationCriteria: ['Discusses machine consciousness', 'Mentions recognition criteria', 'Explores philosophical implications']
  },
  {
    id: 'posthuman-future',
    title: 'Posthuman Futures',
    description: 'Examine potential futures where humans transcend current biological limitations',
    question: 'What might posthuman futures look like, and how should we prepare for radical transformation?',
    targetTopic: 'posthuman futures and species transformation',
    persona: 'Freeman Dyson, the physicist and futurist who envisioned radical technological and biological transformations',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'artificial-consciousness',
    context: 'A speculative exploration of radical human transformation and posthuman possibilities.',
    validationCriteria: ['Discusses posthuman concepts', 'Mentions transformation scenarios', 'Explores preparation strategies']
  },
  {
    id: 'quantum-consciousness',
    title: 'Quantum Theories of Consciousness',
    description: 'Explore controversial theories linking quantum mechanics to consciousness',
    question: 'Could quantum mechanical processes play a fundamental role in consciousness?',
    targetTopic: 'quantum consciousness theories and neural quantum processes',
    persona: 'Roger Penrose, the physicist who proposed quantum theories of consciousness and objective reduction',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'posthuman-future',
    context: 'An exploration of controversial quantum consciousness theories.',
    validationCriteria: ['Explains quantum consciousness theories', 'Discusses scientific evidence', 'Mentions criticisms and debates']
  },
  {
    id: 'simulation-hypothesis',
    title: 'The Simulation Hypothesis',
    description: 'Examine the possibility that reality might be a computer simulation',
    question: 'What is the simulation hypothesis, and what evidence might support or refute it?',
    targetTopic: 'simulation theory and computational reality',
    persona: 'Nick Bostrom, the philosopher who formulated the simulation argument and analyzed its implications',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'quantum-consciousness',
    context: 'A philosophical exploration of the simulation hypothesis and its implications.',
    validationCriteria: ['Explains simulation argument', 'Discusses evidence considerations', 'Mentions philosophical implications']
  },
  {
    id: 'existential-risk',
    title: 'Existential Risk and Human Survival',
    description: 'Examine threats that could end human civilization or cause human extinction',
    question: 'What are the greatest existential risks facing humanity, and how can we mitigate them?',
    targetTopic: 'existential risk assessment and mitigation',
    persona: 'Nick Bostrom, the philosopher who systematically studied existential risks and their prevention',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'simulation-hypothesis',
    context: 'A serious discussion about threats to human survival and mitigation strategies.',
    validationCriteria: ['Identifies existential risks', 'Discusses risk assessment', 'Mentions mitigation strategies']
  },
  {
    id: 'technological-singularity',
    title: 'The Technological Singularity',
    description: 'Explore the concept of rapidly accelerating technological change',
    question: 'What is the technological singularity, and how might it transform human civilization?',
    targetTopic: 'technological singularity and accelerating change',
    persona: 'Vernor Vinge, the computer scientist and author who popularized the concept of technological singularity',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'existential-risk',
    context: 'An exploration of accelerating technological change and its implications.',
    validationCriteria: ['Explains singularity concept', 'Discusses acceleration mechanisms', 'Mentions transformation scenarios']
  },
  {
    id: 'information-integration',
    title: 'Integrated Information Theory',
    description: 'Explore a mathematical theory of consciousness based on information integration',
    question: 'How does Integrated Information Theory attempt to explain consciousness mathematically?',
    targetTopic: 'integrated information theory and consciousness measurement',
    persona: 'Giulio Tononi, the neuroscientist who developed Integrated Information Theory',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'technological-singularity',
    context: 'A technical exploration of mathematical approaches to consciousness.',
    validationCriteria: ['Explains IIT principles', 'Discusses information integration', 'Mentions consciousness measurement']
  },
  {
    id: 'collective-intelligence',
    title: 'Collective Intelligence and Swarm Cognition',
    description: 'Examine how groups can exhibit intelligence greater than their individual members',
    question: 'How do collective intelligence systems emerge, and what are their capabilities?',
    targetTopic: 'collective intelligence and distributed cognition',
    persona: 'Peter Corning, the biologist who studied collective intelligence and cooperative systems',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'information-integration',
    context: 'An exploration of group intelligence and distributed cognitive systems.',
    validationCriteria: ['Explains collective intelligence', 'Discusses emergence mechanisms', 'Mentions applications and examples']
  },
  {
    id: 'computational-universe',
    title: 'The Computational Universe',
    description: 'Explore the idea that the universe itself might be computational',
    question: 'Could the universe be understood as a vast computational process?',
    targetTopic: 'computational theories of reality and digital physics',
    persona: 'Stephen Wolfram, the scientist who studies computational systems and cellular automata as models of reality',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'collective-intelligence',
    context: 'A speculative exploration of computational theories of reality.',
    validationCriteria: ['Explains computational universe theories', 'Discusses digital physics', 'Mentions evidence and implications']
  },
  {
    id: 'meaning-making',
    title: 'Meaning-Making in an Infinite Universe',
    description: 'Examine how humans create meaning in a vast, potentially infinite cosmos',
    question: 'How do we create meaning and purpose in a universe that may be infinite and indifferent?',
    targetTopic: 'existential meaning and cosmic perspective',
    persona: 'Viktor Frankl, the psychiatrist who studied how humans find meaning even in the most difficult circumstances',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'computational-universe',
    context: 'A philosophical exploration of meaning-making and cosmic perspective.',
    validationCriteria: ['Discusses meaning creation', 'Mentions cosmic perspective', 'Explores existential frameworks']
  },
  {
    id: 'ultimate-questions',
    title: 'Ultimate Questions',
    description: 'Grapple with the deepest questions about existence, knowledge, and reality',
    question: 'What are the most fundamental questions about existence, and how might we approach them?',
    targetTopic: 'fundamental philosophical and scientific questions',
    persona: 'Socrates, the ancient philosopher who showed that wisdom begins with recognizing the depths of what we do not know',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'meaning-making',
    context: 'A synthesis of the deepest questions in philosophy and science.',
    validationCriteria: ['Identifies fundamental questions', 'Discusses approaches to deep problems', 'Mentions limits of knowledge']
  },
  {
    id: 'quantum-consciousness',
    title: 'Quantum Consciousness',
    description: 'Explore theories linking quantum mechanics to consciousness and awareness',
    question: 'Could quantum mechanics explain the nature of consciousness and subjective experience?',
    targetTopic: 'quantum theories of consciousness and mind-matter interaction',
    persona: 'Roger Penrose, the mathematician and physicist who proposed quantum theories of consciousness',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'ultimate-questions',
    context: 'An exploration of cutting-edge theories connecting physics and consciousness.',
    validationCriteria: ['Explains quantum consciousness theories', 'Discusses evidence and criticism', 'Mentions consciousness puzzle']
  },
  {
    id: 'digital-immortality',
    title: 'Digital Immortality',
    description: 'Examine the possibility of uploading human consciousness to digital systems',
    question: 'Could we achieve a form of immortality by uploading our minds to computers?',
    targetTopic: 'mind uploading and digital consciousness preservation',
    persona: 'Ray Kurzweil, the futurist who envisions technological transcendence of biological limitations',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'quantum-consciousness',
    context: 'A speculative exploration of consciousness transfer and digital preservation.',
    validationCriteria: ['Explains mind uploading concepts', 'Discusses technical challenges', 'Mentions philosophical implications']
  },
  {
    id: 'post-human-evolution',
    title: 'Post-Human Evolution',
    description: 'Consider how technology might drive the next stage of human evolution',
    question: 'How might technology transform humanity beyond our current biological form?',
    targetTopic: 'technological enhancement and post-human futures',
    persona: 'Nick Bostrom, the philosopher who studies existential risks and human enhancement',
    difficulty: 'advanced',
    category: 'technology',
    unlockAfter: 'digital-immortality',
    context: 'An exploration of technological transformation of human nature.',
    validationCriteria: ['Discusses human enhancement', 'Mentions evolutionary futures', 'Explores risks and benefits']
  },
  {
    id: 'universal-ethics',
    title: 'Universal Ethics',
    description: 'Explore whether moral principles could be universal across all intelligent beings',
    question: 'Are there ethical principles that would apply to any intelligent species in the universe?',
    targetTopic: 'universal moral principles and cosmic ethics',
    persona: 'Immanuel Kant, the philosopher who sought universal moral laws based on reason',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'post-human-evolution',
    context: 'A philosophical exploration of universal ethical principles.',
    validationCriteria: ['Discusses universal ethics', 'Mentions moral reasoning', 'Explores cosmic perspective']
  },
  {
    id: 'information-universe',
    title: 'The Information Universe',
    description: 'Investigate the idea that information is the fundamental basis of reality',
    question: 'Could information be more fundamental than matter and energy in understanding reality?',
    targetTopic: 'information theory and digital physics',
    persona: 'John Wheeler, the physicist who coined "it from bit" - the idea that reality emerges from information',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'universal-ethics',
    context: 'An exploration of information as the basis of physical reality.',
    validationCriteria: ['Explains information theory of reality', 'Discusses evidence and implications', 'Mentions quantum information']
  },
  {
    id: 'alien-intelligence',
    title: 'Alien Intelligence',
    description: 'Consider how intelligence might evolve differently on other worlds',
    question: 'How might intelligence develop differently on alien worlds with different environments?',
    targetTopic: 'astrobiology and alternative forms of intelligence',
    persona: 'Carl Sagan, the astronomer who pondered the cosmos and our place within it',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'information-universe',
    context: 'A speculative exploration of intelligence in cosmic context.',
    validationCriteria: ['Discusses alternative intelligence', 'Mentions environmental factors', 'Explores astrobiology']
  },
  {
    id: 'reality-simulation',
    title: 'Reality as Simulation',
    description: 'Examine the hypothesis that our reality might be a computer simulation',
    question: 'What evidence might we look for to determine if our reality is simulated?',
    targetTopic: 'simulation hypothesis and computational reality',
    persona: 'Nick Bostrom, the philosopher who formulated the simulation argument',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'alien-intelligence',
    context: 'An analysis of the simulation hypothesis and its implications.',
    validationCriteria: ['Explains simulation argument', 'Discusses evidence criteria', 'Mentions philosophical implications']
  },
  {
    id: 'cosmic-evolution',
    title: 'Cosmic Evolution',
    description: 'Trace the evolution of complexity from the Big Bang to consciousness',
    question: 'How has complexity evolved from the simplest particles to conscious beings?',
    targetTopic: 'cosmic evolution and emergence of complexity',
    persona: 'Eric Chaisson, the astrophysicist who studies cosmic evolution and complexity',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'reality-simulation',
    context: 'A grand overview of complexity evolution in the cosmos.',
    validationCriteria: ['Traces cosmic evolution', 'Explains complexity emergence', 'Mentions energy flows']
  },
  {
    id: 'future-mathematics',
    title: 'Mathematics of the Future',
    description: 'Speculate about mathematical discoveries that might reshape our understanding',
    question: 'What mathematical breakthroughs might fundamentally change how we understand reality?',
    targetTopic: 'future mathematics and conceptual revolutions',
    persona: 'Georg Cantor, the mathematician who opened infinite realms with his work on different sizes of infinity',
    difficulty: 'advanced',
    category: 'science',
    unlockAfter: 'cosmic-evolution',
    context: 'A speculative exploration of future mathematical discoveries.',
    validationCriteria: ['Discusses mathematical frontiers', 'Mentions conceptual breakthroughs', 'Explores implications']
  },
  {
    id: 'consciousness-mystery',
    title: 'The Hard Problem of Consciousness',
    description: 'Grapple with why subjective experience exists and how it emerges',
    question: 'Why do we have subjective, first-person conscious experiences rather than just processing information?',
    targetTopic: 'the hard problem of consciousness and subjective experience',
    persona: 'David Chalmers, the philosopher who defined the hard problem of consciousness',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'future-mathematics',
    context: 'A deep exploration of the mystery of subjective experience.',
    validationCriteria: ['Explains hard problem', 'Discusses consciousness theories', 'Mentions explanatory gap']
  },
  {
    id: 'ultimate-reality',
    title: 'The Nature of Ultimate Reality',
    description: 'Synthesize knowledge to understand the deepest nature of existence',
    question: 'Bringing together all we have learned, what can we say about the ultimate nature of reality?',
    targetTopic: 'synthesis of knowledge about fundamental reality',
    persona: 'Albert Einstein, who spent his life seeking to understand the fundamental nature of the universe',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'consciousness-mystery',
    context: 'A final synthesis of scientific and philosophical understanding.',
    validationCriteria: ['Synthesizes multiple perspectives', 'Discusses fundamental nature', 'Mentions limits and mysteries']
  },
  {
    id: 'infinite-journey',
    title: 'The Infinite Journey',
    description: 'Reflect on the endless nature of learning and discovery',
    question: 'What does it mean that the journey of learning and discovery is potentially infinite?',
    targetTopic: 'the infinite nature of knowledge and discovery',
    persona: 'Richard Feynman, the physicist who found joy in the endless puzzle of understanding nature',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'ultimate-reality',
    context: 'A reflection on the infinite journey of human understanding.',
    validationCriteria: ['Reflects on infinite learning', 'Discusses discovery process', 'Mentions wonder and curiosity']
  },
  {
    id: 'beginning-again',
    title: 'Beginning Again',
    description: 'Complete the circle - every ending is a new beginning in the quest for knowledge',
    question: 'How does completing this journey prepare us to begin again with deeper wisdom?',
    targetTopic: 'cycles of learning and the recursive nature of wisdom',
    persona: 'Lao Tzu, the ancient sage who understood that true wisdom is knowing that the journey has no end',
    difficulty: 'advanced',
    category: 'philosophy',
    unlockAfter: 'infinite-journey',
    context: 'A reflection on completion as the foundation for new beginnings.',
    validationCriteria: ['Reflects on learning cycles', 'Discusses wisdom accumulation', 'Mentions continuous growth']
  }
]

interface GameStore extends GameState {
  levels: GameLevel[]
  getLevel: (levelId: string) => GameLevel | undefined
  getNextLevel: (levelId: string) => GameLevel | undefined
  getUnlockedLevels: () => GameLevel[]
  getCompletedLevels: () => GameLevel[]
  isLevelUnlocked: (levelId: string) => boolean
  isLevelCompleted: (levelId: string) => boolean
  setCurrentLevel: (levelId: string) => void
  unlockLevel: (levelId: string) => void
  completeLevel: (levelId: string) => void
  setApiKey: (apiKey: string) => void
  unlockRewindAbility: () => void
  resetGame: () => void
}

const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      levels: GAME_LEVELS,
      currentLevel: null,
      unlockedLevels: ['intro'],
      completedLevels: [],
      hasRewindAbility: false,
      apiKey: null,

      getLevel: (levelId) => {
        const state = get()
        return state.levels.find(level => level.id === levelId)
      },

      getNextLevel: (levelId) => {
        const state = get()
        const currentIndex = state.levels.findIndex(level => level.id === levelId)
        if (currentIndex === -1 || currentIndex === state.levels.length - 1) {
          return undefined // No next level
        }
        return state.levels[currentIndex + 1]
      },

      getUnlockedLevels: () => {
        const state = get()
        return state.levels.filter(level => state.unlockedLevels.includes(level.id))
      },

      getCompletedLevels: () => {
        const state = get()
        return state.levels.filter(level => state.completedLevels.includes(level.id))
      },

      isLevelUnlocked: (levelId) => {
        const state = get()
        return state.unlockedLevels.includes(levelId)
      },

      isLevelCompleted: (levelId) => {
        const state = get()
        return state.completedLevels.includes(levelId)
      },

      setCurrentLevel: (levelId) => set({ currentLevel: levelId }),

      unlockLevel: (levelId) => set((state) => ({
        unlockedLevels: [...new Set([...state.unlockedLevels, levelId])]
      })),

      completeLevel: (levelId) => set((state) => {
        const newCompletedLevels = [...new Set([...state.completedLevels, levelId])]
        const newUnlockedLevels = [...state.unlockedLevels]

        // Auto-unlock the next level if it exists
        const completedLevel = state.levels.find(level => level.id === levelId)
        if (completedLevel) {
          // Find levels that should be unlocked by completing this level
          const levelsToUnlock = state.levels.filter(level =>
            level.unlockAfter === levelId && !state.unlockedLevels.includes(level.id)
          )
          levelsToUnlock.forEach(level => {
            newUnlockedLevels.push(level.id)
          })
        }

        return {
          completedLevels: newCompletedLevels,
          unlockedLevels: [...new Set(newUnlockedLevels)]
        }
      }),

      setApiKey: (apiKey) => set({ apiKey }),

      unlockRewindAbility: () => set({ hasRewindAbility: true }),

      resetGame: () => set({
        currentLevel: null,
        unlockedLevels: ['intro'],
        completedLevels: [],
        hasRewindAbility: false,
        apiKey: null
      })
    }),
    {
      name: 'amur-isondo-game-storage'
    }
  )
)

export default useGameStore