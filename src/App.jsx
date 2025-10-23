import { useEffect } from 'react'
import { createChat } from '@n8n/chat'
import '@n8n/chat/style.css'
import './style.css'
import './App.css'

const LOGO_SRC = '/icons/qsai.jpg'
const WEBHOOK_URL =
  'https://jacobmccartney.app.n8n.cloud/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat'

function App() {
  useEffect(() => {
    const chatApp = createChat({
      webhookUrl: WEBHOOK_URL,
      target: '#n8n-chat',
      mode: 'fullscreen',
      loadPreviousSession: true,
      initialMessages: [
        "Hello, I'm QSAI, your Quran study companion. How can I help you today?"
      ]
    })

    return () => {
      chatApp?.unmount?.()
      document.querySelector('#n8n-chat')?.replaceChildren()
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
          <div id="n8n-chat" className="chat-container" />
        </section>
      </main>
    </>
  )
}

export default App
