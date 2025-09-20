# The Records of Amur Isondo

An educational generative AI game that teaches players about "AI as Simulators" through magical historical conversations.

## Overview

Players use a mystical artifact to summon AI-powered historical guides with unique personas. Through structured conversations, players explore educational topics while learning how AI can simulate different perspectives and knowledge bases.

## Features

- **100 Educational Levels**: Progressive learning journey from beginner to advanced topics
- **Dynamic Persona Creation**: Tag-based system generates unique historical characters
- **Intelligent Conversations**: AI guides adapt their responses based on historical context
- **Smart Question Generation**: Questions evolve to guide players toward research objectives
- **Progress Tracking**: Level completion system with unlock progression
- **Victory Celebrations**: Animated success screens with progression options

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- OpenRouter API key

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd records-of-amur-isondo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

1. Launch the application
2. Enter your OpenRouter API key when prompted
3. Select a level to begin your educational journey

## Game Flow

1. **Level Selection**: Choose from 100 educational topics across multiple categories
2. **Persona Creation**: Select tags to generate a unique historical guide
3. **Conversation**: Engage with your AI guide through structured Q&A
4. **Victory**: Complete the research objective and progress to the next level

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Styling**: Custom CSS with backdrop filters
- **AI Integration**: OpenRouter API
- **Storage**: Browser cookies for persistence

### Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components (ChatPage, LevelSelection, etc.)
├── store/             # Zustand stores (chatStore, gameStore)
├── lib/               # Third-party integrations (OpenRouter)
├── utils/             # Utility functions (content filtering)
├── types/             # TypeScript type definitions
├── assets/            # Static assets
└── styles/            # CSS files
```

## Safety Features

- **Content Filtering**: PG-13 content guidelines with automated filtering
- **Historical Accuracy**: AI prompts emphasize factual, educational responses
- **Limited Inputs**: Structured interaction patterns prevent misuse
- **Prompt Engineering**: Safety measures built into AI conversation flow

## Educational Categories

- **Introduction**: Basic AI and simulation concepts
- **Philosophy**: Thought experiments and ethical considerations
- **Science**: Scientific method and discovery processes
- **Technology**: Innovation and technological development
- **Literature**: Storytelling and narrative perspectives
- **History**: Historical events and cultural contexts

## Contributing

This is an educational project focused on demonstrating AI simulation capabilities. For development:

1. Follow the existing code style and component patterns
2. Maintain TypeScript type safety
3. Test with multiple personas and conversation flows
4. Ensure content remains educational and appropriate

## License

[Add your license information here]

## Support

For technical issues or educational content questions, please refer to the project documentation in `CLAUDE.md`.