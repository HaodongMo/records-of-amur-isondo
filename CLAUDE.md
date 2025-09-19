# The Records of Amur Isondo - Claude Code Configuration

## Project Overview
Educational Generative AI Game built as a React WebApp. Players use a magical artifact to summon AI "spirits" with different personas to answer questions, teaching the concept of "AI as Simulators".

## Architecture
- Self-contained React web application
- OpenRouter API integration for LLM functionality
- Browser cookie storage for persistent data
- Pre-generated assets (images, audio)
- Limited user inputs for safety

## Development Commands

### Setup & Installation
```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Dependencies to Install
```bash
# Core dependencies
npm install @types/react @types/react-dom

# Routing
npm install react-router-dom @types/react-router-dom

# State management
npm install zustand

# UI/Styling
npm install tailwindcss @tailwindcss/typography
npm install clsx

# API/HTTP
npm install axios

# Storage
npm install js-cookie @types/js-cookie
```

## Project Structure
```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── assets/            # Static assets (images, audio)
├── styles/            # CSS/styling files
└── lib/               # Third-party integrations
```

## Key Features to Implement
1. Intro screen (skippable)
2. Level selection system
3. Persona creation with tag selection
4. Chat interface with limited queries
5. Answer verification system
6. Rewind functionality (unlocked after levels)
7. OpenRouter API integration
8. Safety checks and content filtering

## Safety Measures
- Limited predefined user inputs
- Prompt engineering for safe outputs
- Hard-coded banned word checker
- No user-generated content for images/audio