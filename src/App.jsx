import { useEffect, useRef } from 'react'
import { createChat } from '@n8n/chat'
import '@n8n/chat/style.css'
import './style.css'
import './App.css'

const LOGO_SRC = '/icons/qsai.jpg'

const CHAT_CONFIG = {
  webhookUrl:
    'https://jacobmccartney.app.n8n.cloud/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat',
  webhookConfig: {
    method: 'POST',
    headers: {},
  },
  mode: 'fullscreen',
  chatInputKey: 'chatInput',
  chatSessionKey: 'sessionId',
  loadPreviousSession: true,
  metadata: {},
  showWelcomeScreen: false,
  defaultLanguage: 'en',
  initialMessages: [
    "Hello, I'm QSAI, your Quran study assistant. How can I help you today?",
  ],
  i18n: {
    en: {
      title: 'QS-AI',
      subtitle: 'Your Quran Study Assistant',
      footer: '',
      getStarted: 'New Conversation',
      inputPlaceholder: 'Type your question..',
      closeButtonTooltip: 'Close chat window',
    },
  },
  enableStreaming: true,
}

function App() {
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return undefined

    const chatApp = createChat({
      ...CHAT_CONFIG,
      target: container,
    })

    return () => {
      chatApp?.unmount?.()
      container.replaceChildren()
    }
  }, [])

  return (
    <>
      <img src={LOGO_SRC} alt="QS-AI emblem" className="brand-mark" />
      <main className="layout">
        <header className="masthead">
          <h1 className="masthead__title">QS-AI</h1>
          <p className="masthead__badge">Your Quran study companion</p>
        </header>
        <section className="chat-card" aria-label="QS-AI chat window">
          <div ref={chatContainerRef} className="chat-container" />
        </section>
      </main>
    </>
  )
}

export default App
