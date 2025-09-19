
import { useState, useEffect } from 'react'
import backgroundImage from '../assets/background.webp'
import { useChatStore } from '../store/chatStore'

const ChatPage = () => {
  const {
    messages,
    config,
    questionOptions,
    isLoading,
    isGeneratingQuestions,
    hasWon,
    error,
    apiKey,
    sendUserMessage,
    clearMessages,
    setConfig,
    loadApiKeyFromCookie,
    clearApiKey,
    generateInitialQuestions,
    generateFollowUpQuestions
  } = useChatStore()

  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Load API key from cookie and generate initial questions on component mount
  useEffect(() => {
    loadApiKeyFromCookie()
  }, [])

  // Generate initial questions when component mounts (if no questions exist)
  useEffect(() => {
    if (questionOptions.length === 0) {
      generateInitialQuestions()
    }
  }, [questionOptions.length, generateInitialQuestions])

  const handleQuestionSelect = async (optionId: string, questionText: string) => {
    if (isLoading || isGeneratingQuestions) return

    setSelectedOption(optionId)
    await sendUserMessage(questionText)

    // Generate new follow-up questions after the conversation
    setTimeout(() => {
      generateFollowUpQuestions()
    }, 1000) // Small delay to let the conversation complete
  }

  const handleConfigChange = () => {
    const newPersona = prompt('Enter persona:', config.persona)
    const newQuestion = prompt('Enter main question:', config.question)
    const newTopic = prompt('Enter target topic:', config.targetTopic)

    if (newPersona || newQuestion || newTopic) {
      setConfig({
        ...(newPersona && { persona: newPersona }),
        ...(newQuestion && { question: newQuestion }),
        ...(newTopic && { targetTopic: newTopic })
      })
    }
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
          zIndex: 1
        }}
      />

      {/* Black Slanted Texture Bar with Question Title */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom right, rgba(0,0,0,0.4), transparent, rgba(0,0,0,0.2))',
          zIndex: 2
        }}
      >
        {/* Main slanted bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            width: '70%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            transform: 'skewX(-15deg)'
          }}
        />

        {/* Question title on the slanted bar */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#fbbf24',
            margin: '0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            {config.question}
          </h1>
        </div>
      </div>

      {/* Floating Back Button */}
      <button
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          zIndex: 20,
          background: 'rgba(0,0,0,0.7)',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          color: '#fbbf24',
          fontSize: '18px',
          padding: '8px 12px',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)'
        }}
      >
        ←
      </button>

      {/* Timer */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          zIndex: 20,
          color: '#fbbf24',
          fontWeight: 'bold',
          fontSize: '24px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}
      >
        00:00
      </div>

      {/* Character Icons & Settings */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <div style={{
          color: '#fbbf24',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🧞‍♂️ | ⊕
          {apiKey && (
            <span style={{ fontSize: '12px', color: '#22c55e' }}>
              🔑
            </span>
          )}
          {hasWon && (
            <span style={{ fontSize: '16px', color: '#fbbf24' }}>
              🏆
            </span>
          )}
        </div>
        <button
          onClick={handleConfigChange}
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            color: '#fbbf24',
            fontSize: '14px',
            padding: '6px 10px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)'
          }}
        >
          ⚙️ Config
        </button>
        <button
          onClick={clearMessages}
          style={{
            background: 'rgba(0,0,0,0.7)',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            color: '#fbbf24',
            fontSize: '14px',
            padding: '6px 10px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)'
          }}
        >
          🗑️ Clear
        </button>
        <button
          onClick={generateFollowUpQuestions}
          disabled={isGeneratingQuestions || isLoading}
          style={{
            background: 'rgba(59, 130, 246, 0.7)',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            padding: '6px 10px',
            cursor: isGeneratingQuestions || isLoading ? 'not-allowed' : 'pointer',
            opacity: isGeneratingQuestions || isLoading ? 0.6 : 1,
            backdropFilter: 'blur(4px)'
          }}
        >
          🎲 New Q's
        </button>
        {apiKey && (
          <button
            onClick={() => {
              if (confirm('Clear saved API key? You will need to re-enter it next time.')) {
                clearApiKey()
              }
            }}
            style={{
              background: 'rgba(220, 38, 38, 0.7)',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              padding: '6px 10px',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
          >
            🔑 Clear Key
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ position: 'relative', zIndex: 10, height: '100vh', display: 'flex' }}>
        {/* Character Sprite */}
        <div style={{
          position: 'absolute',
          left: '60px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 15,
          width: '280px',
          height: '400px'
        }}>
          <div style={{ color: '#06b6d4', fontSize: '180px', textShadow: '0 0 30px rgba(6, 182, 212, 0.5)' }}>
            🧞‍♂️
          </div>
        </div>

        {/* Chat Messages Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '400px',
          paddingRight: '40px',
          paddingTop: '140px'
        }}>
          {/* Scrollable Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((message, index) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ maxWidth: '420px', position: 'relative' }}>
                  {/* Sender Label */}
                  <div
                    style={{
                      color: '#fbbf24',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      fontSize: '14px',
                      textAlign: message.isUser ? 'right' : 'left',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    {message.sender}
                  </div>

                  {/* Message Box */}
                  <div
                    style={{
                      position: 'relative',
                      padding: '18px 24px',
                      background: message.isUser ?
                        'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)' :
                        'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #1e3a8a 100%)',
                      transform: message.isUser ? 'skewX(12deg)' : 'skewX(-12deg)',
                      border: `3px solid #fbbf24`,
                      clipPath: message.isUser ?
                        'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)' :
                        'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
                      minHeight: '50px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {/* Message Text */}
                    <div
                      style={{
                        transform: message.isUser ? 'skewX(-12deg)' : 'skewX(12deg)',
                        color: 'white',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        fontWeight: '400'
                      }}
                    >
                      {message.text}
                    </div>
                  </div>

                  {/* Arrow pointing to character (only for FLAME messages) */}
                  {!message.isUser && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '-25px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '0',
                        height: '0',
                        borderTop: '12px solid transparent',
                        borderBottom: '12px solid transparent',
                        borderRight: '25px solid #fbbf24'
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Question Options */}
          <div style={{
            position: 'relative',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            border: '3px solid #fbbf24',
            clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
            transform: 'skewX(-8deg)',
            padding: '0',
            margin: '20px 0'
          }}>
            <div style={{
              transform: 'skewX(8deg)',
              padding: '24px 32px'
            }}>
              <div style={{
                color: '#fbbf24',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                QUESTION
              </div>

              {/* Error Display */}
              {error && (
                <div style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.8)',
                  border: '2px solid #ef4444',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  Error: {error}
                </div>
              )}

              {/* Loading Indicators */}
              {isLoading && (
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  border: '2px solid #3b82f6',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  🧞‍♂️ Thinking...
                </div>
              )}

              {isGeneratingQuestions && (
                <div style={{
                  backgroundColor: 'rgba(168, 85, 247, 0.8)',
                  border: '2px solid #a855f7',
                  borderRadius: '4px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: 'white',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  🎲 Generating new questions...
                </div>
              )}

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                {questionOptions.length > 0 ? questionOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleQuestionSelect(option.id, option.text)}
                    disabled={isLoading || isGeneratingQuestions}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 20px',
                      backgroundColor: selectedOption === option.id
                        ? 'rgba(251, 191, 36, 0.4)'
                        : 'rgba(127, 29, 29, 0.8)',
                      border: '2px solid #fbbf24',
                      cursor: (isLoading || isGeneratingQuestions) ? 'not-allowed' : 'pointer',
                      opacity: (isLoading || isGeneratingQuestions) ? 0.6 : 1,
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      borderRadius: '0'
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading && !isGeneratingQuestions) {
                        e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.3)'
                        e.currentTarget.style.transform = 'translateX(6px)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading && !isGeneratingQuestions) {
                        e.currentTarget.style.backgroundColor = selectedOption === option.id
                          ? 'rgba(251, 191, 36, 0.4)'
                          : 'rgba(127, 29, 29, 0.8)'
                        e.currentTarget.style.transform = 'translateX(0)'
                      }
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#fbbf24',
                        color: 'black',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                    >
                      {option.id}
                    </div>
                    <div style={{ color: 'white', fontSize: '15px', lineHeight: '1.5' }}>
                      {option.text}
                    </div>
                  </button>
                )) : !isGeneratingQuestions && (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#fbbf24',
                    fontSize: '14px'
                  }}>
                    No questions available. Click "🎲 New Q's" to generate some!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage